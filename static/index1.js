const SERVER_URL_DEV = "0.0.0.0:5000";
formData = {}

const updateModels = async () => {
	return await axios.get(`http://${SERVER_URL_DEV}/user/update/A`).then(res => res.data)
}

const getAllArtistIds = async () => {
	return await axios.get(`http://${SERVER_URL_DEV}/user/artistIds`).then(res => res.data)
}

const getAllArtists = async () => {
	return await axios.get(`http://${SERVER_URL_DEV}/user`).then(res => res.data)
}

const getArtist = async (artistId) => {
	return await axios.get(`http://${SERVER_URL_DEV}/user/${artistId}`).then(res => res.data)
}

const getArtistMerch = async (artistId) => {
	return await axios.get(`http://${SERVER_URL_DEV}/user/${artistId}/merch`).then(res => res.data)
}

const updateMerch = async (transactions) => {
	return await axios.post(`http://${SERVER_URL_DEV}/user/merch`, transactions).then(res => res.data)
}

window.onload = async () => {
	const formTransactionJson = await fetch('static/submitTransaction.json').then(res => res.text())
	const formHistoryJson = await fetch('static/historyTransaction.json').then(res => res.text())
	const pastTransactions = await fetch('static/transactions.json').then(res => res.text())
	console.log("trans: ", pastTransactions)
	console.log(formTransactionJson)

	
	const formHistory = await Formio.createForm(document.getElementById('formioHistory'), JSON.parse(formHistoryJson));

	console.log(formHistory)
	formHistory.submission.data.curr = {}
	formHistory.submission = {
		data: {
			merchandisesToTransact: JSON.parse(pastTransactions)
		}
	}

	const formTransaction = await Formio.createForm(document.getElementById('formioTransaction'), JSON.parse(formTransactionJson));

	console.log(formTransaction)
	formTransaction.submission.data.curr = {}

	formTransaction.on('change', changed => {
		console.log(changed)
		if (changed.state == 'submitted') {
			return
		}
		const artistIdComponent = formTransaction.getComponent('artistId')
		const merchIdComponent = formTransaction.getComponent('merchId')
		const priceComponent = formTransaction.getComponent('price')
		const qtyComponent = formTransaction.getComponent('qty')
		const datetimeComponent = formTransaction.getComponent('datetime')
		console.log("DT: ", datetimeComponent)
		datetimeComponent.setValue(new Date().toLocaleString('en-GB'));
		const changedCompKey = changed.changed.component.key 
		switch(changedCompKey) {
			case 'artistId':
				formTransaction.submission.data.curr[changedCompKey] = changed.changed.value.value
				break;
			case 'merchId':
				formTransaction.submission.data.curr[changedCompKey] = changed.changed.value.value
				break;
			case 'price':
				formTransaction.submission.data.curr[changedCompKey] = changed.changed.value.value
				break;
			case 'qty':
				formTransaction.submission.data.curr[changedCompKey] = changed.changed.value.value
				break;
		}
		console.log(formTransaction.getComponent('artistId'))
	})

	formTransaction.on('submit', async submission => {
		console.log(submission)
		const formData = submission.data.merchandisesToTransact
		const transactions = formData.map(
			data => ({
				artistId: data.artistId,
				merchId: data.merchId,
				qty: data.qty,
				price: data.price,
				datetime: data.datetime
			})
		) 		
		await updateMerch(
			transactions
		).then(() => {
				window.location.reload()
			}
		)
	})
}
