const assert = require('assert');
const anchor = require('@project-serum/anchor');
const {SystemProgram} = anchor.web3;

//describe is testing block
//it holds different test

describe('calcdapp',()=>{
  //provider is the abstraction of a connection to the Solana network. In the test, the Anchor framework will create the provider for us based on the environment
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  //calculator variable is the keypair generated using anchor.web3 that we will be using to test our program.
  const calculator = anchor.web3.Keypair.generate();

  // program is an abstraction that combines the Provider, idl, and the programID (which is generated when the program is built) and allows us to call RPC methods against our program.
  const program = anchor.workspace.Calcdapp;

  it('Creates a calculator', async () => {
    await program.rpc.create("welcome to rust", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator]
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.greeting === "welcome to rust");
    _calculator = calculator;
  });

  it("Adds two numbers", async function() {
    const calculator = _calculator;
    
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(5)));
    assert.ok(account.greeting === "welcome to rust");
  });

  it('Multiplies two numbers', async function() {
    const calculator = _calculator;

    await program.rpc.multiply(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(6)));
    assert.ok(account.greeting === "welcome to rust");
  })

  it('Subtracts two numbers', async function() {
    const calculator = _calculator;

    await program.rpc.subtract(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(-1)));
    assert.ok(account.greeting === "welcome to rust");
  });

  it('Divides two numbers', async function() {
    const calculator = _calculator;
  
      await program.rpc.divide(new anchor.BN(10), new anchor.BN(3), {
        accounts: {
          calculator: calculator.publicKey,
        },
      });
  
      const account = await program.account.calculator.fetch(calculator.publicKey);
      assert.ok(account.result.eq(new anchor.BN(3)));
      assert.ok(account.remainder.eq(new anchor.BN(1)));
      assert.ok(account.greeting === "welcome to rust");
    });  
});