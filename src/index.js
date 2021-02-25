import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { Machine } from "xstate";
import { useMachine } from "@xstate/react";
import Textfield from "@atlaskit/textfield";
import Button, { ButtonGroup } from "@atlaskit/button";
import {
  FormHeader,
  FormSection,
  FormFooter,
  ErrorMessage
} from "@atlaskit/form";
import "@atlaskit/css-reset";
import machineConfig from "./machineConfig";
import initMachineOptions from "./initMachineOptions";
import { Page, Form, Label, ErrorMessagePlaceholder } from "./components";
import { defer } from "lodash";

const SignInForm = () => {
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const submitButtonnRef = useRef(null);

  const handleEmailInputFocus = () => {
    // using defer as workaround as body element was being focused instead of input element
    defer(() => {
      emailInputRef.current.focus();
    });
  };

  const handlePasswordInputFocus = () => {
    defer(() => {
      passwordInputRef.current.focus();
    });
  };

  const handleSubmitButtonFocus = () => {
    defer(() => {
      submitButtonnRef.current.focus();
    });
  };

  const machineOptions = initMachineOptions(
    handleEmailInputFocus,
    handlePasswordInputFocus,
    handleSubmitButtonFocus
  );
  const signInMachine = Machine(machineConfig, machineOptions);
  const [current, send] = useMachine(signInMachine);

  const handleEmailChange = e => {
    send({
      type: "INPUT_EMAIL",
      email: e.target.value
    });
  };

  const handlePasswordChange = e => {
    send({
      type: "INPUT_PASSWORD",
      password: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    send({ type: "SUBMIT" });
  };

  const handleCancel = e => {
    send({ type: "CANCEL" });
  };

  return (
    <Page>
      <p>
        email: admin@admin.com
        <br />
        password: admin
      </p>

      <Form onSubmit={handleSubmit} noValidate>
        <FormHeader title="Sign in" />

        <FormSection>
          <Label htmlFor="email">Email *</Label>

          <Textfield
            name="email"
            id="email"
            value={current.context.email}
            ref={emailInputRef}
            onChange={handleEmailChange}
            isRequired
            disabled={current.matches("waitingResponse")}
            autoFocus
          />

          {current.matches("ready.email.error") ? (
            <ErrorMessage>
              {current.matches("ready.email.error.empty") &&
                "please enter your email"}
              {current.matches("ready.email.error.badFormat") &&
                "email format doesn't look right"}
              {current.matches("ready.email.error.noAccount") &&
                "no account linked with this email"}
            </ErrorMessage>
          ) : (
            <ErrorMessagePlaceholder />
          )}

          <Label htmlFor="password">Password *</Label>

          <Textfield
            id="password"
            name="password"
            label="Password"
            type="password"
            ref={passwordInputRef}
            value={current.context.password}
            disabled={current.matches("waitingResponse")}
            onChange={handlePasswordChange}
            isRequired
          />

          {current.matches("ready.password.error") ? (
            <ErrorMessage>
              {current.matches("ready.password.error.empty") &&
                "please enter your password"}
              {current.matches("ready.password.error.tooShort") &&
                "password should be at least 5 characters"}
              {current.matches("ready.password.error.incorrect") &&
                "incorrect password"}
            </ErrorMessage>
          ) : (
            <ErrorMessagePlaceholder />
          )}
        </FormSection>

        <FormFooter>
          <ButtonGroup>
            <Button appearance="subtle" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              appearance="primary"
              isLoading={current.matches("waitingResponse")}
              ref={submitButtonnRef}
            >
              Sign in
            </Button>
          </ButtonGroup>
        </FormFooter>
      </Form>
    </Page>
  );
};

ReactDOM.render(<SignInForm />, document.getElementById("root"));
