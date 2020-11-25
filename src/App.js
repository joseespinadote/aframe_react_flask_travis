import React, { Component } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Start from "./Start";
class App extends Component {
  render() {
    return (
      <div className="App">
        <Start />
      </div>
    );
  }
}

export default App;

/*
<GoogleReCaptchaProvider reCaptchaKey="6LfZJeUZAAAAANfi0BPvcnH_Y5DDi-0Ui0YVtAct">
</GoogleReCaptchaProvider>
*/
