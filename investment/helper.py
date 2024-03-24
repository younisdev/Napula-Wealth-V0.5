import torch.nn as nn

from .models import User, Symbol, tracker

hidden_size = 20

input_size = 150

output_size = 3


class NeuralNetwork(nn.Module):

    def __init__(self):

        super(NeuralNetwork, self).__init__()

        self.fc1 = nn.Linear(input_size, hidden_size)

        self.fc2 = nn.Linear(hidden_size, output_size)

        self.activation = nn.ReLU()

    def forward(self, x):

        x = self.activation(self.fc1(x))

        x = self.fc2(x)

        return x
