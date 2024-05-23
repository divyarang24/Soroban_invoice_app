#![cfg(test)]
extern crate std;
use super::*;
use soroban_sdk::{symbol_short, vec, Env,IntoVal};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, HelloContract);
    let client = HelloContractClient::new(&env, &contract_id);
    let client_name = "Dev".into_val(&env);
    let email = "Dev".into_val(&env);
    let date = "12234".into_val(&env);

    let name = vec![&env, "milk".into_val(&env),"cake".into_val(&env)];
    let quantity = vec![&env, 1,2];
    let price = vec![&env, 30,10 ];
    let id = 0;

    let words = client.createInvoice(
        &name,
        &quantity,
        &price,
        &client_name,
        &email,
        &date,
    );
   
    std::println!("*************words********** {:?}", words);
    let invoice = client.get_invoice_by_id(&words);
    std::println!("*************invoice********** {:?}", invoice);
   
   
}