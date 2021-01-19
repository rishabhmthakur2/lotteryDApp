console.log('File loaded')
let web3

// connectToWallet = async () => {
//     event.preventDefault();
//     if (window.ethereum) {
//         web3 = new Web3(window.ethereum);
//         await ethereum.enable();
//     } else if (window.web3) {
//         web3 = new Web3(window.web3.currentProvider);
//     }
//     const accounts = await web3.eth.getAccounts();
//     document.getElementById("connect-web3").value = "Connected to Wallet";
// };

let handleSendTransaction = async (amount, address) => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum)
    await ethereum.enable()
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider)
  }

  console.log(amount, address)
  if (!amount) {
    window.alert('Please enter ethers to invest')
  } else if (!address) {
    window.alert('Please enter referrer address')
  } else if (!web3) {
    window.alert('Not connected to a Web3 Wallet')
  } else if (amount < 0.05) {
    window.alert('Investment amount cannot be less than 0.05 ethers')
  } else {
    let referrerExists = true
    await fetch('/isReferrer/' + address).then(async (response) => {
      response.json().then(async (data) => {
        referrerExists = data.isReferrer
        console.log(data)
        const addresses = await web3.eth.getAccounts()
        const senderAddress = addresses[0]
        const etherATM = new web3.eth.Contract(
          [
            {
              constant: false,
              inputs: [{ name: '_owner', type: 'address' }],
              name: 'setOwner',
              outputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              constant: true,
              inputs: [],
              name: 'collectedFees',
              outputs: [{ name: '', type: 'uint256' }],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [{ name: '', type: 'uint256' }],
              name: 'persons',
              outputs: [
                { name: 'etherAddress', type: 'address' },
                { name: 'amount', type: 'uint256' },
                { name: 'referrer', type: 'address' },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [],
              name: 'payoutIdx',
              outputs: [{ name: '', type: 'uint256' }],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: true,
              inputs: [],
              name: 'balance',
              outputs: [{ name: '', type: 'uint256' }],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
            {
              constant: false,
              inputs: [{ name: 'referrer', type: 'address' }],
              name: 'enter',
              outputs: [],
              payable: true,
              stateMutability: 'payable',
              type: 'function',
            },
            {
              inputs: [],
              payable: false,
              stateMutability: 'nonpayable',
              type: 'constructor',
            },
          ],
          '0x508778dd6f3575635b36b98c44d790fed05bfaad',
        )
        if (referrerExists) {
          etherATM.methods
            .enter(address)
            .send({
              from: senderAddress,
              value: amount * 1000000000000000000,
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
          fetch('/addInvester/' + senderAddress, {
            method: 'POST',
          })
        } else {
          window.alert('Referrer not registered in the system')
        }
      })
    })
  }
}
const defaultAmount = 0.05
const defaultAddress = '0x96B560a99648d4897E3aAdF62347fEB978A1daBE'
const inputAmount = document.getElementById('input-amount')
inputAmount.setAttribute('placeholder', defaultAmount)
inputAmount.setAttribute('value', defaultAmount)
const inputAddress = document.getElementById('input-address')
inputAddress.setAttribute('placeholder', defaultAddress)
inputAddress.innerText = defaultAddress
document.getElementById('btn-send').onclick = function () {
  let amount = inputAmount.value ? inputAmount.value : defaultAmount
  let address = inputAddress.value ? inputAddress.value : defaultAddress
  handleSendTransaction(amount, address)
}
