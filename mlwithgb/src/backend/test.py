import cv2
import numpy as np
import img_dataset
import os

def data2image_CIFAR102(save_dir):
    label_list = []
    _, test_dataloader = img_dataset.dataload_CIFAR10_INFER(100)
    for i, (X, label) in enumerate(test_dataloader):
        for j, img in enumerate(X):
            img_nd2 = img.detach().numpy()
            img_np = img_nd2.copy() * 255
            img_np = np.transpose(img_np, (1, 2, 0))
            img_rgb = cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB)
            cv2.imwrite(os.path.join(save_dir, str(i) + '_' + str(j) + '.png'), img_rgb)
            #label_list.append(label[j])

def main():
    img_dir_cifar = './data_to_img_cifar10'
    data2image_CIFAR102(img_dir_cifar)

if __name__ == '__main__':
    main()