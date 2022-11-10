function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => resolve(true)
		script.onerror = () => resolve(false)
		document.body.appendChild(script)
	})
}
function RazorpayButton(props) {
	async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const data = await fetch('https://192.168.2.235/api/razorpay', {method: 'POST'}).then((t) => t.json())
		const options = {
			key: 'rzp_test_lzmoFzw17LDqLa',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			description: 'Thank you for nothing. Please give us some money',
			image: 'https://pbs.twimg.com/profile_images/1063925348205821958/DlGcxdOl_400x400.jpg',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
			prefill: {
				name: 'Gaurav Kumar',
				email: 'gaurav.kumar@example.com',
				// contact: '9999999999',
			},
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}
	return (
		<button className="btn btn-primary w-25" onClick={displayRazorpay} id="rzp-button">
			Pay
		</button>
	)
}

export default RazorpayButton
