console.log('File loaded')
let web3
let lotterySM
let initContract = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum)
    await ethereum.enable()
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider)
  }
  if (web3) {
    lotterySM = new web3.eth.Contract(
      [
        {
          inputs: [],
          name: 'closeGame',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'guess',
              type: 'uint256',
            },
          ],
          name: 'makeGuess',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'startNewLottery',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        {
          inputs: [],
          name: 'withdrawAdminFees',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getGuess',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getOwner',
          outputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getStatus',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getWinnersList',
          outputs: [
            {
              internalType: 'address payable[]',
              name: '',
              type: 'address[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'getWinningNumber',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      '0xe45ed8B45a88Be8A45908B99714DF7497395114A',
    )
    console.log({ lotterySM })
    lotterySM.methods
      .getTokens()
      .call({
        from: senderAddress,
      })
      .then((balance) => {
        document.getElementById('tokenCount').defaultValue = balance
      })
  } else {
    window.alert('Not connected to a Web3 Wallet')
  }
}
let handleWinnerCheckTransaction = async () => {
  if (!web3) {
    window.alert('Not connected to a Web3 Wallet')
  } else {
    const addresses = await web3.eth.getAccounts()
    const senderAddress = addresses[0]
    console.log(senderAddress)
    let data = lotterySM.methods
      .getWinnersList()
      .call()
      .then((winners) => {
        console.log({ winners })
        // document.getElementById('tokenCount').defaultValue = balance
      })
  }
}
initContract()
document.getElementById('btn-checkToken').onclick = function () {
  handleWinnerCheckTransaction()
}
