module.exports = {
  confirmEmail: token => (
    `<div style="background-color: #0074D9; border-radius: 5px; padding: 10px;" }>
      <div style="border: 2px solid white; border-radius: 5px; padding: 10px;">
        <h1 style="font-size: 32px; color: white; text-align: center; font-size: 75px; text-shadow: 1px 1px grey;">Let's Toast</h1>
        <h1 style="font-size: 16px; color: white; text-shadow: 1px 1px grey;">Hello,</h1>
        <p style="font-size: 16px; color: white; text-shadow: 1px 1px grey;">You are receiving this because you (or someone else) have requested to use this email in his/her account.</p>
        <p style="font-size: 16px; color: white; text-shadow: 1px 1px grey;">Please click on the following link, or paste it into your browser to complete the process:</p>
        <p style="font-size: 16px; color: white; text-shadow: 1px 1px grey;"><a href="http://localhost:3000/confirm/${token}" style="color: #00d1b2;">http://localhost:3000/confirm/${token}</a></p>
        <p style="font-size: 16px;color: white; text-shadow: 1px 1px grey;">Have a nice day!</p>
      </div>
    <div>`),
  resetPassword: token => (
    `<div style="background-color: #0074D9; border-radius: 5px; padding: 10px;" }>
      <div style="border: 2px solid white; border-radius: 5px; padding: 10px;">
        <h1 style="font-size: 32px; color: white; text-align: center; font-size: 75px; text-shadow: 1px 1px grey;">Let's Toast</h1>
        <h1 style="font-size: 16px; color: white; text-shadow: 1px 1px grey;">Hello,</h1>
        <p style="font-size: 16px; color: white; text-shadow: 1px 1px grey;">You are receiving this because you (or someone else) have requested to reset his/her password.</p>
        <p style="font-size: 16px; color: white; text-shadow: 1px 1px grey;">Please click on the following link, or paste it into your browser to complete the process within one hour of receveing it:</p>
        <p style="font-size: 16px; color: white; text-shadow: 1px 1px grey;"><a href="http://localhost:3000/reset/update/${token}" style="color: #00d1b2;">http://localhost:3000/reset/update/${token}</a></p>
        <p style="font-size: 16px; color: white; text-shadow: 1px 1px grey;">Have a nice day!</p>
      </div>
    <div>`)
};