
const helloService = require('../services/helloService.js');
console.log(helloService)
module.exports = {
	getHello: (req, res) => {
		const helloMessage = helloService.getHelloMessage();
		res.json({message: helloMessage});
	}

}
