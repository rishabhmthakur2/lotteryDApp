console.log('File loaded')
let web3
let lotterySM
let lotteryStatus
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
    let data = lotterySM.methods
      .getStatus()
      .call()
      .then((status) => {
        lotteryStatus = status
        console.log({ status })
        if (status == true) {
          document.getElementById('lotteryStatus').defaultValue = 'Active'
          document.getElementById('btn-startStopLottery').value = 'Stop Lottery'
        } else {
          document.getElementById('lotteryStatus').defaultValue = 'Inactive'
          document.getElementById('btn-startStopLottery').value =
            'Start Lottery'
        }
      })
  } else {
    window.alert('Not connected to a Web3 Wallet')
  }
}
let handleStartLotteryTransaction = async () => {
  if (!web3) {
    window.alert('Not connected to a Web3 Wallet')
  } else {
    const addresses = await web3.eth.getAccounts()
    const senderAddress = addresses[0]
    console.log(senderAddress)
    let ownerCall = lotterySM.methods
      .getOwner()
      .call()
      .then((owner) => {
        if (owner != senderAddress) {
          window.alert('Only contract owner/admin can perform this action')
        } else {
          let data = lotterySM.methods
            .startNewLottery()
            .send({
              from: senderAddress,
            })
            .on('receipt', (receipt) => {
              window.alert('Lottery started')
              window.location.reload()
            })
        }
      })
  }
}
let handleStopLotteryTransaction = async () => {
  if (!web3) {
    window.alert('Not connected to a Web3 Wallet')
  } else {
    const addresses = await web3.eth.getAccounts()
    const senderAddress = addresses[0]
    console.log(senderAddress)
    let ownerCall = lotterySM.methods
      .getOwner()
      .call()
      .then((owner) => {
        if (owner != senderAddress) {
          window.alert('Only contract owner/admin can perform this action')
        } else {
          let data = lotterySM.methods
            .closeGame()
            .send({
              from: senderAddress,
            })
            .on('receipt', (receipt) => {
              window.alert('Lottery stopped')
              window.location.reload()
            })
        }
      })
  }
}

let handleWithdrawFeesTransaction = async () => {
  if (!web3) {
    window.alert('Not connected to a Web3 Wallet')
  } else {
    const addresses = await web3.eth.getAccounts()
    const senderAddress = addresses[0]
    console.log(senderAddress)
    let ownerCall = lotterySM.methods
      .getOwner()
      .call()
      .then((owner) => {
        if (owner != senderAddress) {
          window.alert('Only contract owner/admin can perform this action')
        } else {
          let data = lotterySM.methods
            .withdrawAdminFees()
            .call({
              from: senderAddress,
            })
            .on('transactionHash', (hash) => {
              window.open('https://ropsten.etherscan.io/tx/' + hash)
              window.location.reload()
            })
        }
      })
  }
}

initContract()
document.getElementById('btn-startStopLottery').onclick = function () {
  if (!lotteryStatus) {
    handleStartLotteryTransaction()
  } else {
    handleStopLotteryTransaction()
  }
}

document.getElementById('btn-send').onclick = function () {
  if (lotteryStatus) {
    window.alert('Fees can be withdrawn only when lottery is inactive')
  } else {
    handleWithdrawFeesTransaction()
  }
}
