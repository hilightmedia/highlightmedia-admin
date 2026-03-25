import SiteLayout from "@/src/components/layout/siteLayout";
import Players from "@/src/components/players";

interface Props {
  query: {
    status: string
  };
}

const PlayersPage = ({query}: Props) => {
 const status = query.status || "all";
  return (
    <SiteLayout>
      <Players status={status}/>
    </SiteLayout>
  );
};

export default PlayersPage;

PlayersPage.getInitialProps = async ({query}: Props) => {
  return {query};
};