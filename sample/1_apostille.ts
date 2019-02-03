import { NEMLibrary, NetworkTypes, Account, TransactionHttp, Address, TransferTransaction, TimeWindow, XEM, HexMessage } from 'nem-library'
import * as fs from 'fs';
import * as crypto from 'crypto';

NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

const account = Account.createWithPrivateKey('YOUR_PRIVATE_KEY');
const transactionHttp = new TransactionHttp([{protocol: 'https', domain: 'nistest.opening-line.jp', port: 7891}]);

// testnet public apostille sink address
const sinkAddress = new Address('TC7MCY5AGJQXZQ4BN3BOPNXUVIGDJCOHBPGUM2GE');

const filePath = __dirname + '/sample.txt';
let data: string;

try {
  data = fs.readFileSync(filePath, 'binary');
} catch(err) {
  console.error(err);
}

const message = apostilleMessage(data);

const apositlleTx = TransferTransaction.create(
  TimeWindow.createWithDeadline(),
  sinkAddress,
  new XEM(0),
  HexMessage.create(message)
);

const signedTx = account.signTransaction(apositlleTx);

transactionHttp.announceTransaction(signedTx).subscribe(
  // to use apostille namespace and mosaic
  (x) => { console.log(x.transactionHash.data) },
  (err) => { console.error(err) }
);

function apostilleMessage(data: string) {
  const prefix = '4e545903';
  const shasum = crypto.createHash('sha256');
  shasum.update(data);
  return shasum.digest('hex');
}