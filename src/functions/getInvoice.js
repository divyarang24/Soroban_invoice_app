import * as SorobanClient from 'stellar-sdk'; // // import * as SorobanClient from "stellar-sdk"import base64 from 'base-64'
import { encode } from './encode';

import * as returnval from './convertreturnvalues';

const xdr = SorobanClient.xdr



const contractId ='CBS7PE7ZZYIAIMMM5DH5FQNJ2GUZ6AS4X42WXTL724YTGJUL2OYMAVD5';
const pk = 'GDNX3F6UZ32K2VWEIG7VBF27XFMV7CRWK6UAG4ESH6OYGZTQRG77UP5R';
const secret = 'SBI64OPGA3RINC2XZQSAL2JWTHJQID7KYWNIBX4UY3UVLHMQKY6DIXSK';


export const get_invoice = async (id) => {
        const server = new SorobanClient.SorobanRpc.Server(
            `https://soroban-testnet.stellar.org:443`
        );
        const contract = new SorobanClient.Contract(contractId);
        const account = await server.getAccount(pk);
       

        let method = 'get_invoice_by_id'


       const obj1 =  { type: 'scoU128', value: id};
        
        const params = [
            encode(obj1),
        ];

        let tx = new SorobanClient.TransactionBuilder(account, {
            fee: '200',
            networkPassphrase: SorobanClient.Networks.TESTNET,
        })
            .addOperation(contract.call(method, ...params))
            .setTimeout(SorobanClient.TimeoutInfinite)
            .build();

        const sim = await server.simulateTransaction(tx);
        // const { results } = await server.simulateTransaction(tx) as any;
        const { result } = await server.simulateTransaction(tx) ;

        let result2 = JSON.parse(JSON.stringify(result.retval));
        let return_vaule = returnval.scvalToBigNumber(result2._arm,result2);
         console.log("🚀 ~ test ~ return_vaule:", return_vaule)
         return return_vaule
        // console.log("🚀 ~ file: 0_get_vault.ts:47 ~ test ~ results:", results)

        // if (!results || results.length !== 1) {
        //     throw new Error('Invalid response from simulateTransaction');
        // }
        // const result = results[0];

        // let _ans = decode.scvalToBigNumber(
        //     xdr.ScVal.fromXDR(Buffer.from(result.xdr, 'base64'))
        //   );
        // console.log("🚀 ~ file: get_vault.ts:57 ~ test ~ _ans:", _ans)
      

        // let _prepareTx = await server.prepareTransaction(tx)
        // _prepareTx.sign(SorobanClient.Keypair.fromSecret(secret))

        // try {
        //     let { hash } = await server.sendTransaction(_prepareTx);
        //     console.log("🚀 ~ test ~ hash", hash)

        //     const sleepTime = Math.min(1000, 60000);

        //     for (let i = 0; i <= 60000; i += sleepTime) {
        //         await sleep(sleepTime);
        //         try {
        //             //get transaction response
        //             const response = await server?.getTransaction(hash);
        //             console.log("🚀 ~ file: hello_world.ts:99 ~ test ~ response:", response.status)
        //             if ( response.status == "SUCCESS") {
        //                let result = JSON.parse(JSON.stringify(response.returnValue));
        //                let return_vaule = returnval.scvalToBigNumber(result._arm,result);
        //                 console.log("🚀 ~ test ~ return_vaule:", return_vaule)
        //                 return return_vaule
        //             }
                    
        //             }
        //          catch (err) {
        //             if ('code' in err && err.code === 404) {
        //                 console.log('🚀 ~ withdraw ~ err', err);
        //             } else {
        //                 throw err;
        //             }
        //         }
        //     }
        // } catch (error) {
        //     console.log("🚀 ~ test ~ error", error)

        // }
    }


    async function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    
