import * as SorobanClient from 'stellar-sdk';
import { encode } from './encode';

import * as returnval from './convertreturnvalues';


const xdr = SorobanClient.xdr



const contractId ='CBS7PE7ZZYIAIMMM5DH5FQNJ2GUZ6AS4X42WXTL724YTGJUL2OYMAVD5';
const pk = 'GDNX3F6UZ32K2VWEIG7VBF27XFMV7CRWK6UAG4ESH6OYGZTQRG77UP5R';
const secret = 'SBI64OPGA3RINC2XZQSAL2JWTHJQID7KYWNIBX4UY3UVLHMQKY6DIXSK';


export const createInvoice = async (
    name, 
    quantity,
    price,
    client_name,
    email,
    date,
) => {
        console.log("🚀 ~ date:", date)
        console.log("🚀 ~ email:", email)
        console.log("🚀 ~ client_name:", client_name)
        console.log("🚀 ~ price:", price)
        console.log("🚀 ~ quantity:", quantity)
        console.log("🚀 ~ name:", name)
        const server = new SorobanClient.SorobanRpc.Server(
            `https://soroban-testnet.stellar.org:443`
        );
        const contract = new SorobanClient.Contract(contractId);
        const account = await server.getAccount(pk);
       
   

        let method = 'createInvoice'

       const obj1 =  { type: 'vecString', value: name};
       const obj2 =  { type: 'veci32', value: quantity};
       const obj3 =  { type: 'veci32', value: price};
       const obj4 =  { type: 'scvString', value: client_name};
       const obj5 =  { type: 'scvString', value: email};
       const obj6 =  { type: 'scvString', value: date};

 
        const params = [
            encode(obj1),
            encode(obj2),
            encode(obj3),
            encode(obj4),
            encode(obj5),
            encode(obj6),
        ];

        let tx = new SorobanClient.TransactionBuilder(account, {
            fee: '200',
            networkPassphrase: SorobanClient.Networks.TESTNET,
        })
            .addOperation(contract.call(method, ...params))
            .setTimeout(SorobanClient.TimeoutInfinite)
            .build();
        console.log("🚀 ~ tx:", tx)

        const sim = await server.simulateTransaction(tx);
        console.log("🚀 ~ test ~ sim:", sim)
        // const { results } = await server.simulateTransaction(tx) as;

      

        let _prepareTx = await server.prepareTransaction(tx)
        _prepareTx.sign(SorobanClient.Keypair.fromSecret(secret))

        try {
            let { hash } = await server.sendTransaction(_prepareTx);
            console.log("🚀 ~ test ~ hash", hash)

            const sleepTime = Math.min(1000, 60000);

            for (let i = 0; i <= 60000; i += sleepTime) {
                await sleep(sleepTime);
                try {
                    //get transaction response
                    const response = await server?.getTransaction(hash);
                    console.log("🚀 ~ file: hello_world.ts:99 ~ test ~ response:", response.status)
                    if ( response.status == "SUCCESS") {
                       let result = JSON.parse(JSON.stringify(response.returnValue));
                       let return_vaule = returnval.scvalToBigNumber(result._arm,result);
                        console.log("🚀 ~ test ~ return_vaule:", return_vaule)
                        return return_vaule
                    }
                    
                    }
                 catch (err) {
                    if ('code' in err && err.code === 404) {
                        console.log('🚀 ~ withdraw ~ err', err);
                    } else {
                        throw err;
                    }
                }
            }
        } catch (error) {
            console.log("🚀 ~ test ~ error", error)

        }
    }

// test();

    async function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    
