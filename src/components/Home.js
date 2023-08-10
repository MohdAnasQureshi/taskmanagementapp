import Tasks from "./Tasks";
import Console from "./Console";

const Home = (props) => {
  const { showAlert } = props;
  return (
    <div>
      <Tasks showAlert={showAlert} />
      <Console />
    </div>
  );
};

export default Home;
