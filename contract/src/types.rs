use soroban_sdk::{contracttype, Address, Bytes, BytesN, Symbol, Vec,String};

#[derive(Clone, Debug, PartialEq)]
#[contracttype]
pub struct InvoiceItem {
    pub id :i32,
    pub client_name : String,
    pub email : String,
    pub date : String,
    pub name: Vec<String>,
    pub quantity: Vec<i32>,
    pub price: Vec<i32>,
    pub total:i32
}



#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Invoice(u128),
    InvoiceId,
}





