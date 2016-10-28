<?php
// Mail Script Festigeek 2016
// Date: 25 October 2016
// Author: Mysteriosis <P-A Curty>
header('Content-Type: application/json');

// Do not forget to add this bad boy
require_once 'config.mail.php';

// Libraries
require 'vendors/phpMailer/PHPMailerAutoload.php';

// CONFIGURATION
$subject = 'Nouveau message du site OnePage2016';

// 0 = Production (No Debug), 1 = only the message status, 2 = Full Debug
$debug = 0;

// MESSAGES
$okMessage = 'Votre demande de contact nous a été correctement transmise. Nous y répondrons dans les meilleurs délais.';
$captchaMessage = 'Erreur de vérification du CAPTCHA';
$errorMessage = 'Erreur lors de l\'envoi du formulaire. Réessayez ultérieurement.';
$responseArray = NULL;

// DATA PROCESSING
$lastname = (isset($_POST['lastname']) && !empty($_POST['lastname'])) ? $_POST['lastname'] : NULL;
$firstname = (isset($_POST['firstname']) && !empty($_POST['firstname'])) ? $_POST['firstname'] : NULL;
$email = (isset($_POST['email']) && !empty($_POST['email'])) ? $_POST['email'] : NULL;
$phone = (isset($_POST['phone']) && !empty($_POST['phone'])) ? $_POST['phone'] : '-';
$message = (isset($_POST['message']) && !empty($_POST['message'])) ? $_POST['message'] : NULL;
$captcha = (isset($_POST['g-recaptcha-response']) && !empty($_POST['g-recaptcha-response'])) ? $_POST['g-recaptcha-response'] : '';

if(is_null($lastname) || is_null($firstname) || is_null($email) || is_null($message) || is_null($captcha)) {
    $responseArray = array('type' => 'danger', 'message' => 'Champ(s) obligatoire(s) ou CAPTCHA manquant(s).');
    exit(json_encode($responseArray));
}

// CHECKING ReCAPTCHA
$response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$CAPTCHAKEY&response=$captcha&remoteip=" . $_SERVER['REMOTE_ADDR']);

if ($debug != 2 && $response.success == false) {
    $responseArray = array('type' => 'danger', 'message' => $captchaMessage);
}
else {
  // MESSAGE PROCESSING
  $messageHTML = "<h3>Informations sur l'expéditeur</h3>";
  $messageHTML .= "<b>Nom</b>: $lastname<br />";
  $messageHTML .= "<b>Prénom</b>: $firstname<br />";
  $messageHTML .= "<b>Tél.</b>: $phone<br />";
  $messageHTML .= "<br />";
  $messageHTML .= "<h3>Message</h3>";
  $messageHTML .= $message;

  // SENDING MAIL
  $mail = new PHPMailer();
  $mail->CharSet = 'UTF-8';
  $mail->setLanguage('fr', '/vendors/PHPMailer/lang/');
  $mail->isSMTP();
  $mail->SMTPDebug = ($debug == 2 ? 2 : 0);
  $mail->Debugoutput = 'html';
  $mail->Host = $MAIL_SERVER;
  $mail->SMTPAuth = true;
  $mail->SMTPAutoTLS = false;
  $mail->Port = 25;

  //Custom connection options (Not verifying the certificate)
  $mail->SMTPOptions = array(
      'ssl' => array(
          'verify_peer' => false,
          'verify_peer_name' => false,
          'allow_self_signed' => true,
      )
  );

  $mail->Username = $MAIL_USER;
  $mail->Password = $MAIL_PASS;
  $mail->setFrom($email, "$firstname $lastname");
  $mail->addAddress($MAIL_TO);
  $mail->Subject = $subject;
  $mail->isHTML(true);
  $mail->msgHTML($messageHTML);

  if (!$mail->send()) {
      $responseArray = array('type' => 'danger', 'message' => $errorMessage, 'info' => $mail->ErrorInfo);
  } else {
      $responseArray = array('type' => 'success', 'message' => $okMessage);
  }
}

exit(json_encode($responseArray));
