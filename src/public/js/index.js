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
      '0x33Ec3FCC11fFab3a0bA9346551Bb42F57bDD45ad',
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
        } else {
          document.getElementById('lotteryStatus').defaultValue = 'Inactive'
        }
      })
  } else {
    window.alert('Not connected to a Web3 Wallet')
  }
}

let handleSendTransaction = async (amount) => {
  if (!web3) {
    window.alert('Not connected to a Web3 Wallet')
  } else {
    const addresses = await web3.eth.getAccounts()
    const senderAddress = addresses[0]
    console.log(senderAddress)
    lotterySM.methods
    lotterySM.methods
      .getOwner()
      .call()
      .then((owner) => {
        if (owner == senderAddress) {
          window.alert(`Contract owner/admin can't perform this action`)
        } else {
          lotterySM.methods
            .makeGuess(amount)
            .send({
              from: senderAddress,
              value: 1000000000000000000,
            })
            .on('transactionHash', function (hash) {
              document.getElementById('btn-send').value = 'View Transaction'
              document.getElementById('btn-send').onclick = function () {
                window.open('https://ropsten.etherscan.io/tx/' + hash)
                window.location.reload()
              }
            })
            .on('error', function (error) {
              window.alert(JSON.stringify(error.stack))
            })
        }
      })
  }
}
initContract()
const defaultAmount = 1
const inputAmount = document.getElementById('input-amount')
inputAmount.setAttribute('placeholder', defaultAmount)
inputAmount.setAttribute('value', defaultAmount)
document.getElementById('btn-send').onclick = function () {
  let amount = inputAmount.value ? inputAmount.value : defaultAmount
  if (parseInt(amount) < 1 || parseInt(amount) > 1000000) {
    window.alert('Number should be between 1 and 1000000')
  } else {
    if (!lotteryStatus) {
      window.alert('Lottery inactive')
    } else {
      handleSendTransaction(amount)
    }
  }
}
