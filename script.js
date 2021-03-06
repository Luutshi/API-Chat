import { connectToken, getUserData, getChatData, deleteMessage, sendMessage, putMessage } from "./api.js"

document.addEventListener('DOMContentLoaded', () => {
    let ignoreList = []
    let userListT = document.querySelector('#userList')

    function ignoreListFunc() {
        if (localStorage['ignoreList']) {
            ignoreList = localStorage['ignoreList'].split(', ')
        }
        
        let ignoredUsers = document.querySelectorAll('.ignoredUser')
        ignoredUsers.forEach((user) => {
            user.remove()
        })

        ignoreList.slice(1).forEach((ignoredUser) => {
            let newDiv = document.createElement('div')

            let usernameP = document.createElement('p')
            let usernameContent = document.createTextNode(ignoredUser)
            usernameP.appendChild(usernameContent)

            let unignoreButton = document.createElement('button')
            let buttonContent = document.createTextNode('Unignore')
            unignoreButton.className = ignoredUser
            unignoreButton.appendChild(buttonContent)

            newDiv.appendChild(usernameP)
            newDiv.appendChild(unignoreButton)
            newDiv.className = 'ignoredUser'

            userListT.appendChild(newDiv)

            unignoreButton.addEventListener('click', () => {
                ignoreList.forEach((user) => {
                    if (user === unignoreButton.className) {
                        localStorage.setItem('ignoreList', localStorage.getItem('ignoreList').replaceAll(`, ${user}`, ''));
                    }
                })

                ignoreListFunc()
                ignoreList = localStorage['ignoreList'].split(', ')
                highestId = 0
                document.querySelectorAll('#chat > div').forEach((p) => {
                    p.remove()
                })
            })
        })
    }
    ignoreListFunc()

    function phoneTime() {
        function addZero(i) {
            if (i < 10) {i = "0" + i}
            return i;
        }
          
        const d = new Date();
        let h = addZero(d.getHours());
        let m = addZero(d.getMinutes());
        let time = h + ":" + m;

        document.querySelector('#phone-hour').innerText = time;
    }

    let highestId = 0;
    let login = document.querySelector('section#login')
    let chatSession = document.querySelector('section#chat-session');

    function testFunc(message, userNickname) {
        if (message['id'] > highestId) {
            let newDiv = document.createElement('div')
            let secondDiv = document.createElement('div')
            newDiv.id = 'message'+message['id']

            if (message['nickname'] === userNickname) {
                highestId = message['id']
                newDiv.className = 'user'

                newDiv.addEventListener('click', function() {
                    document.querySelectorAll('.deleteButton').forEach((button) => {
                        button.remove()
                    })

                    document.querySelectorAll('.editButton').forEach((button) => {
                        button.remove()
                    })

                    let optionsDiv = document.createElement('div')
                    let deleteButton = document.createElement('button')
                    let editButton = document.createElement('button')
                    let buttonContent = document.createTextNode('Delete')
                    deleteButton.className = 'deleteButton'
                    deleteButton.appendChild(buttonContent)
                    optionsDiv.appendChild(deleteButton)
                    buttonContent = document.createTextNode('Edit')
                    editButton.className = 'editButton'
                    editButton.appendChild(buttonContent)
                    optionsDiv.appendChild(editButton)
                    secondDiv.appendChild(optionsDiv);

                    deleteButton.addEventListener('click', () => {
                        let messageId = newDiv.id
                        let idRegex = new RegExp(/message(\d+)/)

                        deleteMessage(messageId, idRegex).then((data) => {
                            if (data) {
                                document.querySelector(`#${messageId}`).remove()
                            }
                        })
                    })

                    editButton.addEventListener('click', () => {
                        editMessage(newDiv, secondDiv)
                    })

                })

                let userMessage = document.createElement('p')
                let messageContent = document.createTextNode(message['message'])
                userMessage.className = 'userMessage'
                userMessage.appendChild(messageContent)
                secondDiv.appendChild(userMessage)
    
                let hourRegex = new RegExp(/(\d{2}:\d{2}):\d{2}/)
                let createdAt = document.createElement('p')
                messageContent = document.createTextNode(message['createdAt'].match(hourRegex)[1])
                createdAt.className = 'createdAt'
                createdAt.appendChild(messageContent)
                secondDiv.appendChild(createdAt)
    
                newDiv.appendChild(secondDiv)
                chat.appendChild(newDiv);
                chat.scrollTo(0, chat.scrollHeight);
            } else {
                let count = 0;
                ignoreList.forEach((ignoredUser) => {
                    if (message['nickname'] === ignoredUser) {
                        count++;
                    }
                })

                if (count === 0) {
                    let nickname = document.createElement('p')
                    nickname.append(document.createTextNode(message['nickname']))
                    nickname.className = 'nickname'
                    secondDiv.appendChild(nickname)

                    newDiv.addEventListener('click', function() {
                        document.querySelectorAll('.ignoreButton').forEach((button) => {
                            button.remove()
                        })
    
                        let optionsDiv = document.createElement('div')
                        let ignoreButton = document.createElement('button')
                        let buttonContent = document.createTextNode('Ignore')
                        ignoreButton.className = 'ignoreButton'
                        ignoreButton.appendChild(buttonContent)
                        optionsDiv.appendChild(ignoreButton)
                        secondDiv.appendChild(optionsDiv);
    
                        ignoreButton.addEventListener('click', () => {
                            highestId = 0
                            document.querySelectorAll('#chat > div').forEach((p) => {
                                p.remove()
                            })

                            if (localStorage.getItem("ignoreList")) {
                                if (!localStorage.getItem("ignoreList").includes(message['nickname'])) {
                                    localStorage.setItem("ignoreList", localStorage.getItem("ignoreList") + ', ' + message['nickname'])
                                }        
                            } else {
                                localStorage.setItem("ignoreList", `, ${message['nickname']}`)
                            }
                        
                            ignoreListFunc()
                        })
                    })

                    let userMessage = document.createElement('p')
                    let messageContent = document.createTextNode(message['message'])
                    userMessage.className = 'userMessage'
                    userMessage.appendChild(messageContent)
                    secondDiv.appendChild(userMessage)
        
                    let hourRegex = new RegExp(/(\d{2}:\d{2}):\d{2}/)
                    let createdAt = document.createElement('p')
                    messageContent = document.createTextNode(message['createdAt'].match(hourRegex)[1])
                    createdAt.className = 'createdAt'
                    createdAt.appendChild(messageContent)
                    secondDiv.appendChild(createdAt)
        
                    newDiv.appendChild(secondDiv)
                    chat.appendChild(newDiv);
                    chat.scrollTo(0, chat.scrollHeight);
                }
            }
        }

        
    }

    if (localStorage.getItem('token')) {
        login.style.display = 'none'
        chatSession.style.display = 'block'
        getUserData().then((userNickname) => {
            phoneTime()
            setInterval(phoneTime, 1000)
            setInterval(() => {
                getChatData().then((data) => {
                    data['data'].reverse().forEach((message) => {
                        testFunc(message, userNickname)
                    })
                })
            }, 100)
        })
    } else {
        document.querySelector('input#loginButton').addEventListener('click', () => {
            connectToken(document.querySelector('input#email'), document.querySelector('input#password')).then((data) => {
                if (data) {
                    login.style.display = 'none'
                    chatSession.style.display = 'block'
                    getUserData().then((userNickname) => {
                        phoneTime()
                        setInterval(phoneTime, 100)
                        setInterval(() => {
                            getChatData().then((data) => {
                                data['data'].reverse().forEach((message) => {
                                    testFunc(message, userNickname)
                                })
                            })
                        }, 100)
                    })
                }
            })
        })
    }

    function editMessage(divMessage, secondDiv) {
        let messageId = divMessage.id
        let inputText = document.createElement('textarea')
        inputText.id = 'edit'+messageId
        let inputContent = document.createTextNode(document.querySelector(`#${divMessage.id} > div > .userMessage`).innerText)
        if (document.querySelector(`#${divMessage.id} > div > .userMessage`)) {
            document.querySelector(`#${divMessage.id} > div > .userMessage`).remove()
            inputText.appendChild(inputContent)
            secondDiv.appendChild(inputText);

            let idRegex = new RegExp(/message(\d+)/)

            document.querySelector(`#edit${divMessage.id}`).addEventListener('keypress', function (key) {
                if (key['key'] === 'Enter') {
                    putMessage(inputText, idRegex)

                    let newMessage = document.createElement('p')
                    let messageContent = document.createTextNode(inputText.value)
                    newMessage.className = 'userMessage'
                    newMessage.appendChild(messageContent)
                    document.querySelector(`#${divMessage.id} > div > textarea`).remove()
                    secondDiv.appendChild(newMessage)
                }
            });
        }
}

    function logout() {
        Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, disconnect me!'
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token')
                login.style.display = 'block'
                chatSession.style.display = 'none'
            }
        })
    }

    let clickCount = 0;
    function userList() {
        if (clickCount % 2 == 0) {
            clickCount++
            chat.style.display = 'none'
            userListT.style.display = 'flex'
            showIgnored.innerText = 'Show Chat'
        }
        else {
            clickCount++
            chat.style.display = 'flex'
            userListT.style.display = 'none'
            showIgnored.innerText = 'Ignored Users'

            
        }
    }

    document.querySelector('#showIgnored').addEventListener('click', () => {
        userList()
        ignoreListFunc()
        chat.scrollTo(0, chat.scrollHeight);
    })

    document.querySelector('#message').addEventListener('keypress', (key) => {
        if (key['key'] === 'Enter') {
            sendMessage(document.querySelector('input#message'))
            document.querySelector('#message').value = ''
        }
    });

    document.querySelector('#sendMessage').addEventListener('click', () => {
        sendMessage(document.querySelector('input#message'))
        document.querySelector('#message').value = ''
    })

    logoutButton.addEventListener('click', logout)
})