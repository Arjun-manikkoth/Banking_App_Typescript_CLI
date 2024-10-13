import { faker } from "@faker-js/faker";
import { select, input } from "@inquirer/prompts";
import chalk from "chalk";
//customer class
class Customer {
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobileNo = mob;
        this.accNumber = acc;
    }
}
//class Bank
class Bank {
    constructor() {
        this.customer = [];
        this.account = [];
    }
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let NewAccount = this.account.filter(acc => acc.accNumber !== accObj.accNumber);
        this.account = [...NewAccount, accObj];
    }
}
let myBank = new Bank();
//customer create
for (let i = 1; i <= 10; i++) {
    let fName = faker.person.firstName('male');
    let lName = faker.person.lastName('male');
    let num = parseInt(faker.string.numeric('10'));
    const customer = new Customer(fName, lName, 25 * i, 'male', num, 1000 + i);
    myBank.addCustomer(customer);
    myBank.addAccountNumber({ accNumber: customer.accNumber, balance: 100 });
}
//Bank functionality
async function bankService(bank) {
    const service = await select({
        message: 'Please Select the Service',
        choices: [
            {
                name: 'View Balance',
                value: 'View Balance',
            },
            {
                name: 'Cash Withdraw',
                value: 'Cash Withdraw',
            }, {
                name: 'Cash Deposit',
                value: 'Cash Deposit',
            }
        ],
    });
    if (service == "View Balance") {
        let res = await input({
            message: "Please enter your Account Number"
        });
        let account = myBank.account.find((acc) => {
            return acc.accNumber == parseInt(res);
        });
        if (account) {
            let name = myBank.customer.find((item) => {
                return item.accNumber == account?.accNumber;
            });
            console.log("Dear " + chalk.yellow.italic(name?.firstName) + " your account balance is : " + account.balance);
        }
        else {
            console.log(chalk.red.bold("Invalid Account Number"));
        }
    }
    if (service == "Cash Withdraw") {
        let res = await input({
            message: "Please enter your Account Number"
        });
        let account = myBank.account.find((acc) => {
            return acc.accNumber == parseInt(res);
        });
        if (!account) {
            console.log(chalk.red.bold.italic("Invalid Account Number"));
        }
        if (account) {
            let ans = await input({
                message: "Please enter the amount"
            });
            let newBalance = account.balance - parseInt(ans);
            if (newBalance > account.balance) {
                console.log("Insufficient Funds");
            }
            else {
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log("Your current balance is " + newBalance);
            }
        }
    }
    if (service == "Cash Deposit") {
        let res = await input({
            message: "Please enter your Account Number"
        });
        let account = myBank.account.find((acc) => {
            return acc.accNumber == parseInt(res);
        });
        if (!account) {
            console.log(chalk.red.bold.italic("Invalid Account Number"));
        }
        if (account) {
            let ans = await input({
                message: "Please enter the amount"
            });
            let newBalance = account.balance + parseInt(ans);
            bank.transaction({ accNumber: account.accNumber, balance: newBalance });
            console.log("Your current balance is " + newBalance);
        }
    }
}
bankService(myBank);
