import os
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
import cv2
import numpy as np


# MNIST dataloader
def dataload_MNIST(batch_size):
    train_data = datasets.MNIST(
        root="./data",
        train=True,
        transform=transforms.ToTensor(),
        download=True
    )
    
    test_data = datasets.MNIST(
        root="./data",
        train=False,
        transform=transforms.ToTensor(),
        download=True
    )

    train_dataloader = DataLoader(dataset=train_data,
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=1)
    
    test_dataloader = DataLoader(dataset=test_data,
                                 batch_size=batch_size,
                                 shuffle=True)
    
    return train_dataloader, test_dataloader

# CIFAR-10 dataloader
def dataload_CIFAR10(batch_size):
    train_data = datasets.CIFAR10(
        root='./data', 
        train=True, 
        transform=transforms.ToTensor(),
        download=True
        )
    
    test_data = datasets.CIFAR10(
        root='./data',
        train=False,
        transform=transforms.ToTensor(),
        download=True
    )

    train_dataloader = DataLoader(dataset=train_data,
                                  batch_size=batch_size,
                                  shuffle=True,
                                  num_workers=1)
    
    test_dataloader = DataLoader(dataset=test_data,
                                 batch_size=batch_size,
                                 shuffle=True)
    
    return train_dataloader, test_dataloader

# MNISTでの推論時に呼び出されるdataloader(shuffleがfalse)
def dataload_MNIST_INFER(batch_size):
    train_data = datasets.MNIST(
        root="./data",
        train=True,
        transform=transforms.ToTensor(),
        download=True
    )
    
    test_data = datasets.MNIST(
        root="./data",
        train=False,
        transform=transforms.ToTensor(),
        download=True
    )

    train_dataloader = DataLoader(dataset=train_data,
                                  batch_size=batch_size,
                                  shuffle=False,
                                  num_workers=1)
    
    test_dataloader = DataLoader(dataset=test_data,
                                 batch_size=batch_size,
                                 shuffle=False)
    
    return train_dataloader, test_dataloader

# CIFAR-10での推論時に呼び出されるdataloader(shuffleがfalse)
def dataload_CIFAR10_INFER(batch_size):
    train_data = datasets.CIFAR10(
        root='./data', 
        train=True, 
        transform=transforms.ToTensor(),
        download=True
        )
    
    test_data = datasets.CIFAR10(
        root='./data',
        train=False,
        transform=transforms.ToTensor(),
        download=True
    )

    train_dataloader = DataLoader(dataset=train_data,
                                  batch_size=batch_size,
                                  shuffle=False,
                                  num_workers=1)
    
    test_dataloader = DataLoader(dataset=test_data,
                                 batch_size=batch_size,
                                 shuffle=False)
    
    return train_dataloader, test_dataloader

# MNISTでの推論時に画像を取得するためのdataset
def dataset_MNIST_100():
    dataset = datasets.MNIST(
        root="./data",
        train=False,
        transform=transforms.ToTensor(),
        download=True
    )

    return dataset

# CIFAR-10での推論時に画像を取得するためのdataset
def dataset_CIFAR10_100():
    dataset = datasets.CIFAR10(
        root='./data',
        train=False,
        transform=transforms.ToTensor(),
        download=True
    )

    return dataset

# バッチサイズを100としてMNISTデータセットをpng形式の画像に変換する関数
def data2image_MNIST(save_dir): 
    label_list = []
    cache_file = os.path.join(save_dir, 'mnist.cache')

    if not os.path.exists(cache_file):
        _, test_dataloader = dataload_MNIST_INFER(100)
        for i, (X, label) in enumerate(test_dataloader):
            for j, img in enumerate(X):
                img_np = img[0].detach().numpy().copy() * 255
                cv2.imwrite(os.path.join(save_dir, str(i) + '_' + str(j) + '.png'), img_np)
                label_list.append(label[j])

        with open(cache_file, 'w') as f:
            f.write('')
            f.close()

# バッチサイズを100としてCIFAR-10データセットをpng形式の画像に変換する関数
def data2image_CIFAR10(save_dir):
    label_list = []
    cache_file = os.path.join(save_dir, 'cifar10.cache')

    if not os.path.exists(cache_file):
        _, test_dataloader = dataload_CIFAR10_INFER(100)
        for i, (X, label) in enumerate(test_dataloader):
            for j, img in enumerate(X):
                img_np = img.detach().numpy().copy() * 255
                img_np = np.transpose(img_np, (1, 2, 0))
                img_rgb = cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB)
                cv2.imwrite(os.path.join(save_dir, str(i) + '_' + str(j) + '.png'), img_rgb)
                label_list.append(label[j])

        with open(cache_file, 'w') as f:
            f.write('')
            f.close()