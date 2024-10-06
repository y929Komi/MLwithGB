from torch import nn

# モデルの定義

class SimpleNeuralNetwork(nn.Module):
    def __init__(self, activation, input_size):
        super(SimpleNeuralNetwork, self).__init__()
        self.flatten = nn.Flatten()
        self.linear_stack = nn.Sequential(
            nn.Linear(input_size, 100),
            activation,
            nn.Linear(100, 10),
            activation
        )

    def forward(self, x):
        x = self.flatten(x)
        y = self.linear_stack(x)
        return y

class SimpleConvNet(nn.Module):
    def __init__(self, activation, input_channel, kernel_size):
        super(SimpleConvNet, self).__init__()
        self.conv_layer1 = nn.Sequential(
            nn.Conv2d(input_channel, 16, kernel_size),
            activation,
            nn.MaxPool2d(2, stride=2)
        )

        self.conv_layer2 = nn.Sequential(
            nn.Conv2d(16, 32, kernel_size),
            activation,
            nn.MaxPool2d(2, stride=2)
        )

        self.fully_connect = nn.Sequential(
            nn.Linear(32*5*5, 120),
            activation,
            nn.Linear(120, 10)
        )

    def forward(self, x):
        x = self.conv_layer1(x)
        x = self.conv_layer2(x)
        if x.dim() == 3:
            x = x.view(1, -1)
        else:
            x = x.view(x.size()[0], -1)
        y = self.fully_connect(x)
        return y