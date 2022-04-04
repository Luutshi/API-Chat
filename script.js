import { connectToken, getUserData, getChatData, deleteMessage, sendMessage, putMessage } from "./api.js"

document.addEventListener('DOMContentLoaded', () => {  
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
            highestId = message['id']
            let newDiv = document.createElement('div')
            let secondDiv = document.createElement('div')
            newDiv.id = 'message'+message['id']        
            newDiv.className = 'ignored'     

            if (message['nickname'] === userNickname) {
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
                    let ignoreButton = document.createElement('button')
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

            } else {
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
                        console.log(message['id'])
                    })
                })
            }

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
            }, 1000)
        })
    } else {
        document.querySelector('input#loginButton').addEventListener('click', () => {
            connectToken(document.querySelector('input#email'), document.querySelector('input#password')).then((data) => {
                if (data) {
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
                        }, 1000)
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
        localStorage.removeItem('token')
        login.style.display = 'block'
        chatSession.style.display = 'none'
    }

    document.querySelector('#message').addEventListener('keypress', function (key) {
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