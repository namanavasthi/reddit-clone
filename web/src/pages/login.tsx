import React from "react";

import { Form, Formik } from "formik";
import { Box, Button, FormControl } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

export const Login: React.FC<{}> = ({}) => {
  const router = useRouter();

  const [, login] = useLoginMutation();

  return (
    <Wrapper>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });

          /*
           * errors is an array that looks something like
           * [{field: 'username', message: 'somethings wrong'}]
           * write a utility to convert array into an object
           * as `setErrors` requires an object of key value pairs
           * where key = field in the form
           * value = the error message
           */

          if (response.data?.login.errors) {
            console.log(toErrorMap(response.data.login.errors));
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data.login.user) {
            // we got the user back
            // things worked as planned
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl>
              <InputField name="username" placeholder="username" label="Username" />
              <Box mt={4}>
                <InputField name="password" placeholder="password" label="Password" type="password" />
              </Box>
              <Button mt={4} isLoading={isSubmitting} type="submit" colorScheme="teal">
                Login
              </Button>
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
