
#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, String, Symbol, Vec};

mod types;
use types::*;

fn get_and_inc_Invoice_id(env: &Env) -> u128 {
    let prev = env
        .storage()
        .persistent()
        .get(&DataKey::InvoiceId)
        .unwrap_or(0u128);
    // .unwrap();

    let value = &prev + 1;

    let one_day_ledger:u32 = 17280;
    let high_waterfall =  30 * one_day_ledger ;
    let low_waterfall = high_waterfall - one_day_ledger;

    env.storage().persistent().set(&DataKey::InvoiceId, &value);
    env.storage().persistent().extend_ttl(&DataKey::InvoiceId,low_waterfall ,high_waterfall);

    prev
}

#[contract]
pub struct HelloContract;


#[contractimpl]
impl HelloContract {


    pub fn hello(env: Env, to: String) -> String {
        // vec![&env, symbol_short!("Hello"), to]
        to
    }
    
    pub fn createInvoice(env: Env, 
        name: Vec<String>, 
        quantity: Vec<i32>, 
        price: Vec<i32>,
        client_name : String,
    email : String,
    date : String,
    )-> u128 {
        let iteam_price =  price.clone();
        let sum = iteam_price.iter().sum();
        
        let Invoice_id = get_and_inc_Invoice_id(&env);
        let id = Invoice_id as i32;
        let item = InvoiceItem {
            id,
            client_name,
            email,
            date,
            name,
            quantity,
            price,
            total:sum
        };

        
       
        env.storage().persistent().set(&DataKey::Invoice(Invoice_id), &item);

    // bump contract for month
    let one_day_ledger:u32 = 17280;
    let high_waterfall =  30 * one_day_ledger ;
    let low_waterfall = high_waterfall - one_day_ledger;
    
    env.storage().persistent().extend_ttl(&DataKey::Invoice(Invoice_id),low_waterfall ,high_waterfall);
    

    Invoice_id
    }

   pub fn get_invoice_by_id(env: &Env, vault_id: u128) -> InvoiceItem{
    let data = env
    .storage()
    .persistent()
    .get(&DataKey::Invoice(vault_id))
    .unwrap();
   data
   }

   pub fn get_length(env:&Env)->u128{
    let prev = env
    .storage()
    .persistent()
    .get(&DataKey::InvoiceId)
    .unwrap_or(0u128);
prev
   }


}

mod test;