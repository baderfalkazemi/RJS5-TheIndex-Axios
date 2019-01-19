import React, { Component } from "react";
import axios from "axios";

// Components
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";
import Loading from "./Loading";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAuthor: {},
      filteredAuthors: [],
      authors: [],
      loading: true
    };
    this.selectAuthor = this.selectAuthor.bind(this);
    this.unselectAuthor = this.unselectAuthor.bind(this);
    this.filterAuthors = this.filterAuthors.bind(this);
  }

  selectAuthor(author) {
    this.setState({ loading: true });
    axios
      .get(`http://the-index-api.herokuapp.com/api/authors/${author.id}/`)
      .then(res => res.data)
      .then(data => {
        this.setState({
          currentAuthor: data,
          loading: false
        });
        console.log(this.state.currentAuthor);
      })
      .catch(err => console.error(err));
  }

  unselectAuthor() {
    this.setState({ currentAuthor: {} });
  }

  filterAuthors(query) {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${author.first_name} ${author.last_name}`.includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  }

  getContentView() {
    if (this.state.loading) {
      return <Loading />;
    } else if (this.state.currentAuthor.first_name) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else {
      return (
        <AuthorsList
          authors={this.state.authors}
          selectAuthor={this.selectAuthor}
        />
      );
    }
  }

  componentDidMount() {
    axios
      .get("https://the-index-api.herokuapp.com/api/authors/")
      .then(res => res.data)
      .then(data => this.setState({ authors: data, loading: false }))
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">
            <SearchBar filterAuthors={this.filterAuthors} />
            {this.getContentView()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
