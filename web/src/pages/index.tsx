import { Box } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Box>
      <NavBar />
      <h1>Hello World!</h1>
      <br />
      {!data ? <Box>loading...</Box> : data.getPosts.map((p) => <Box key={p.id}>{p.title}</Box>)}
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
