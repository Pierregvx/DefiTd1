var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
const exerciceSolution = artifacts.require("ExerciceSolution.sol");
const myERC20 = artifacts.require("MyERC20.sol");


const account = "0xCe32fFEf8BA0FBCaeCEa2578ca103884139F9156"
const TDTokenAddress = "0xccCf36429190773Fd604a808Cb03f682136B007e"
const claimableTokenAddress = "0x754a4F8D05f9A4157C355d42E8334999Ea5d66c9"
const evaluatorAdress = "0x1987D516D14eBf3025069504b1aD2257516C426a"

module.exports = (deployer, network, accounts) => {
    if(network != 'rinkeby') return
	deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await deployRecap(deployer, network, accounts);
		await getPoints(deployer, network, accounts);
		await deploySolution(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.at(TDTokenAddress)
	ClaimableToken = await ERC20Claimable.at(claimableTokenAddress)
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.at(evaluatorAdress)
}

async function deploySolution(deployer, network, accounts) {
	MyERC20  = await myERC20 .new()
	Solution = await exerciceSolution.new(ClaimableToken.address, MyERC20.address, {from:account})
	await MyERC20.setMinter(Solution.address, true, {from:account})
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
	// console.log("Solution " + Solution.address)
}

async function getPoints(deployer, network, accounts) {
	const startBalance = await TDToken.balanceOf(accounts[0])
	console.log("startBalance " + startBalance)

	
	await deploySolution(deployer, network, accounts)
	console.log("Solution " + Solution.address)
	console.log("MyERC20 " + MyERC20.address)

	
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