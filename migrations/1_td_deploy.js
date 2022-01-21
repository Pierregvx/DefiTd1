var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
const exerciceSolution = artifacts.require("ExerciceSolution.sol");
const myERC20 = artifacts.require("MyERC20.sol");




module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
		
        // await deployTDToken(deployer, network, accounts); 
        // await deployEvaluator(deployer, network, accounts); 
        // await setPermissionsAndRandomValues(deployer, network, accounts);
        // await deployRecap(deployer, network, accounts);
		// await getPoints(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	console.log(accounts[0])
	
	TDToken = await TDErc20.new("TD-ERC20-101","TD-ERC20-101",web3.utils.toBN("20000000000000000000000000000"))
	if(network == 'rinkeby')TDToken = await TDErc20.at("0xccCf36429190773Fd604a808Cb03f682136B007e");

	
	ClaimableToken = await ERC20Claimable.new("ClaimableToken","CLTK",web3.utils.toBN("20000000000000000000000000000"))
	if(network == 'rinkeby')ClaimableToken = await ERC20Claimable.at("0x754a4F8D05f9A4157C355d42E8334999Ea5d66c9")
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address)//Ganache
	console.log("evaluator")
	if(network == 'rinkeby')Evaluator = await evaluator.at("0x1987D516D14eBf3025069504b1aD2257516C426a")//rinkeby
	
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
}



async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function delploy(deployer, network, accounts){

	const account = accounts[0];
	MyERC20 = await myERC20.new()
	Solution = await exerciceSolution.new(ClaimableToken.address, MyERC20.address, {from:account})//ganache
	
}

async function getPoints(deployer, network, accounts) {

	const account = accounts[0];
	
	
	const startBalance = await TDToken.balanceOf(accounts[0])
	console.log("startBalance " + startBalance)
	
	
	console.log("Solution " + Solution.address)

	
	console.log("==============================\n            Submit            \n==============================")
	await Evaluator.submitExercice(Solution.address , {from:account})
	var balance = await TDToken.balanceOf(account)
	console.log("initial balance " + balance)

	
	console.log("==============================\n          Exercice 1          \n==============================")
	await Evaluator.ex1_claimedPoints({from: account})
	balance = await TDToken.balanceOf(account)
	console.log("new balance " + balance)

	
	console.log("==============================\n          Exercice 2          \n==============================")
	
	await Evaluator.ex2_claimedFromContract({from:account})
	balance = await TDToken.balanceOf(account)
	console.log("new balance " + balance)

	
	console.log("==============================\n          Exercice 3          \n==============================")
	
	await Evaluator.ex3_withdrawFromContract({from:account})
	balance = await TDToken.balanceOf(account)
	console.log("new balance " + balance)

	
	console.log("==============================\n          Exercice 4          \n==============================")
	
	await ClaimableToken.approve(Solution.address, 100, {from:account})
	await Evaluator.ex4_approvedExerciceSolution({from:account})
	balance = await TDToken.balanceOf(account)
	console.log("new balance " + balance)

	
	console.log("==============================\n          Exercice 5          \n==============================")
	
	await ClaimableToken.decreaseAllowance(Solution.address,100)
	await Evaluator.ex5_revokedExerciceSolution({from:account})
	balance = await TDToken.balanceOf(account)
	console.log("new balance " + balance)

	
	console.log("==============================\n          Exercice 6          \n==============================")
	
	await Evaluator.ex6_depositTokens({from:account})
	balance = await TDToken.balanceOf(account)
	console.log("new balance " + balance)

	console.log("==============================\n          Exercice 7          \n==============================")
	await MyERC20.setMinter(Solution.address, true)
	await Evaluator.ex7_createERC20({from:account})
	balance = await TDToken.balanceOf(account)
	console.log("new balance " + balance)

	console.log("==============================\n          Exercice 8          \n==============================")
	
	await Evaluator.ex8_depositAndMint({from:account})
	balance = await TDToken.balanceOf(account)
	console.log("new balance " + balance)
	console.log("==============================\n          Exercice 9          \n==============================")
	
	await Evaluator.ex9_withdrawAndBurn({from:account})
	balance = await TDToken.balanceOf(account)
	console.log("new balance " + balance)
}