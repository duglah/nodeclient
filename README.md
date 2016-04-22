# nodeclient
Client node lib for slackbot node network

======
This project is part a slackbot node network.

It is the lib for the client. It will register a command to the main node and wait for a command from the main node.

## Start
1. Write a client, which uses this lib
2. Start the main node (See https://github.com/duglah/slackbotnode )
3. Start your client

You can find an example test node at https://github.com/duglah/testnode.

If you would like to control a rgb led strip via your slackbot you should check out https://github.com/duglah/rgbnode .
It is a node which recieves commands from slack and sends them to the [rgb-pi](https://github.com/ryupold/rgb-pi)
(Nice project!) server.

## Todos
* Write documentation
* Clean up code


## License
```
The MIT License (MIT)

Copyright (c) 2016 Philipp Geitz-Manstein

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
