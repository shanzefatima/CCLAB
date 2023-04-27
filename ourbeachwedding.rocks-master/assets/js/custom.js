// https://ourbeachwedding.rocks
// https://github.com/ourbeachwedding.rocks

$(function() {
	//$('#rsvp-form').modal('show');

	$('#rsvp-form form').submit(function(e) {
		e.preventDefault();

		var form = $(this);
		var btn = form.find('[type=submit]');
		var attendingValue = $('#attending-ghost').is(":checked");
		$('#attending').val(attendingValue);

		if ($("input[name='email']").val() === '') {
			alert('Please enter an email address')
			return
		}

		$.ajax({
			url: form.prop('action'),
			type: 'POST',
			crossDomain: true,
			headers: {
				'accept': 'application/javascript',
			},
			data: form.serialize(),
			beforeSend: function() {
				btn.prop('disabled', 'disabled');
			}
		}).done(function(response) {
			$('#rsvp-form #rsvp-success').hide().removeClass('hidden').fadeIn();
			btn.prop('disabled', false);
		}).fail(function(response) {
			alert('Form failed, please try again.');
			btn.prop('disabled', false);
		});
	});

});
