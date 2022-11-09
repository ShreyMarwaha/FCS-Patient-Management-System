import React, {useEffect} from 'react'

function RazorpayButton(props) {
	useEffect(() => {
		const Script = document.createElement('script')
		const Form = document.getElementById('donateForm')
		Script.setAttribute('src', 'https://checkout.razorpay.com/v1/payment-button.js')
		Script.setAttribute('data-payment_button_id', props.button_id)
		Form.appendChild(Script)
	}, [])

	async function paymentHandler() {
		const data = await fetch('https://192.168.2.235/api/razorpay', {
			method: 'POST',
		}).then((t) => t.json())
		const options = {
			key: 'rzp_test_lzmoFzw17LDqLa',
			currency: data.currency,
			amount: data.amount,
			name: 'Learning To Code Online',
			description: 'Test Wallet Transaction',
			order_id: data.id,
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
			prefill: {
				name: 'Anirudh Jwala',
				email: 'anirudh@gmail.com',
				contact: '9999999999',
			},
		}

		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}
	return (
		<>
			<form id="donateForm" />
			<button onClick={paymentHandler}>Make Payment</button>
		</>
	)
}

export default RazorpayButton
