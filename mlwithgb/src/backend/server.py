from flask import Flask
from flask import request, jsonify
from flask_cors import CORS
import os
import torch
import random
import base64
from torch import nn

import dnn_models
import img_dataset

# hyper parameters
BATCH_SIZE = 64
EPOCHS = 10

# global variables
current_epoch = 0
img_idx_x = 0
img_idx_y = 0
cur_acc = 0

app = Flask(__name__)
CORS(app)

def train(dataLoader, model, loss_f, optim):
    size = len(dataLoader.dataset)
    for batch, (X, y) in enumerate(dataLoader):
        pred = model(X)
        loss = loss_f(pred, y)

        optim.zero_grad()
        loss.backward()
        optim.step()

        if batch % 100 == 0:
            loss, current = loss.item(), batch * len(X)
            print(f"loss: {loss:>7f} [{current:>5d}/{size:>5d}]")

def test(dataLoader, model, loss_f):
    size = len(dataLoader.dataset)
    test_loss, correct = 0, 0

    with torch.no_grad():
        for X, y in dataLoader:
            pred = model(X)
            test_loss += loss_f(pred, y).item()
            correct += (pred.argmax(1) == y).type(torch.float).sum().item()
        
        test_loss /= size
        correct /= size
        print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Average loss: {test_loss:>8f} \n")
        return test_loss, correct
    
def optimizer_select(optim, model_param, learning_rate):
    if optim == 'SGD':
        return torch.optim.SGD(model_param, lr=learning_rate, momentum=0.8)
    elif optim == 'Adam':
        return torch.optim.Adam(model_param, lr=learning_rate)
    elif optim == 'Adagrad':
        return torch.optim.Adagrad(model_param, lr=learning_rate)
    
def act_func_select(act_func):
    if act_func == 'Sigmoid':
        return nn.Sigmoid()
    elif act_func == 'ReLU':
        return nn.ReLU()
    elif act_func == 'Hardtanh':
        return nn.Hardtanh()
    
def input_datasize(dataset):
    # データセットごとに入力画像のサイズ等を定義
    if dataset == 'MNIST':
        # input size=28*28
        # input channel=1
        # kernel size(CNN)=3
        return [28*28, 1, 3]
    elif dataset == 'CIFAR-10':
        # input size=32*32
        # input channel=3
        # kernel size(CNN)=5
        return [32*32, 3, 5]
    
def model_select(model, act_func, input_size, input_channel):
    if model == 'SimpleConv':
        return dnn_models.SimpleConvNet(act_func, input_channel)
    elif model == 'SimpleNN':
        return dnn_models.SimpleNeuralNetwork(act_func, input_size)
    
def train_dataloader_select(dataset, batch_size):
    if dataset == 'MNIST':
        train_dataloader, test_dataloader = img_dataset.dataload_MNIST(batch_size=batch_size)
        return train_dataloader, test_dataloader
    elif dataset == 'CIFAR-10':
        train_dataloader, test_dataloader = img_dataset.dataload_CIFAR10(batch_size=batch_size)
        return train_dataloader, test_dataloader
    
def train_dataset_select(dataset):
    if dataset == 'MNIST':
        return img_dataset.dataset_MNIST_100()
    elif dataset == 'CIFAR-10':
        return img_dataset.dataset_CIFAR10_100()
    
def img_dir_path(dataset):
    # png画像化したデータセットを保存するディレクトリを指定
    if dataset == 'MNIST':
        return './data_to_img_mnist'
    elif dataset == 'CIFAR-10':
        return './data_to_img_cifar10'

# 学習の進捗及び正解率json形式で送信
@app.route("/progressLearn")
def get_progress():
    global cur_acc
    prog_learn = current_epoch/EPOCHS * 100
    send_dict = {'progress' : prog_learn, 'accuracy' : cur_acc}
    return jsonify(send_dict)

# 画像をランダムに選択してフロント側にbase64形式で送信
@app.route("/sendimage")
def send():
    global img_idx_x, img_idx_y, train_dataset
    image_path = img_dir_path(train_dataset)
    batch_idx_x = random.randint(0, 99)
    batch_idx_y = random.randint(0, 99)
    img_idx_x = batch_idx_x
    img_idx_y = batch_idx_y
    image_path = os.path.join(image_path, str(img_idx_x) + '_' + str(img_idx_y) +'.png')
    print(image_path)
    with open(image_path, 'rb') as f:
        send_img = f.read()

    send_bin = base64.b64encode(send_img).decode('utf-8')
    return jsonify({'src' : send_bin})

# 推論
@app.route("/infer")
def infer():
    global img_idx_x, img_idx_y, train_model, train_dataset
    infer_dataset = train_dataset_select(train_dataset)
    dataset_class = infer_dataset.classes

    with torch.no_grad():
        img, label = infer_dataset[img_idx_x * 100 + img_idx_y]
        pred = train_model(img).argmax(1).item()
        return jsonify({'pred': dataset_class[pred], 'label': dataset_class[label]})

#　モデル等のハイパーパラメータを選択
@app.route("/setModel", methods=["POST"])
def set():
    global train_model, train_dataset
    hyper_param = request.get_json()
    act_func = act_func_select(hyper_param['activation'])
    train_dataset = hyper_param['dataset']
    input_feature = input_datasize(train_dataset)
    train_model = dnn_models.SimpleConvNet(act_func, input_feature[1], input_feature[2])
    
    return str("")

# データセットを画像化する際に呼び出される
@app.route("/dataset")
def expand():
    savedir_mnist = img_dir_path('MNIST')
    savedir_cifar10 = img_dir_path('CIFAR-10')

    if not os.path.exists(savedir_mnist):
        os.makedirs(savedir_mnist)

    if not os.path.exists(savedir_cifar10):
        os.makedirs(savedir_cifar10)

    img_dataset.data2image_MNIST(savedir_mnist)
    img_dataset.data2image_CIFAR10(savedir_cifar10)

    return str("")

# 学習
@app.route("/train", methods=["POST"])
def run():
    global train_model, cur_acc, current_epoch, train_dataset
    current_epoch = 0
    cur_acc = 0
    hyper_param = request.get_json()

    act_func = act_func_select(hyper_param['activation'])
    input_feature = input_datasize(train_dataset)

    model_nn = dnn_models.SimpleConvNet(act_func, input_feature[1], input_feature[2])
    loss_function = nn.CrossEntropyLoss()
    optimizer = optimizer_select(hyper_param['optimizer'], model_nn.parameters(), float(hyper_param['lr']))
    loss_test = []
    acc_test = []
    train_dataloader, test_dataloader = train_dataloader_select(train_dataset, BATCH_SIZE)
    for t in range(EPOCHS):
        print(f"Epoch {t+1}\n +-----------------------+")
        train(train_dataloader, model_nn, loss_function, optimizer)
        loss , acc = test(test_dataloader, model_nn, loss_function)
        current_epoch = t+1
        loss_test.append(loss)
        acc_test.append(acc)
        cur_acc = acc

    train_model = model_nn
        
    return str("")

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000)