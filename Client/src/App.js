import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ReactSpinner from 'react-spinjs';
import Header from './Components/Header';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      title : undefined,
      tags : undefined
    };

    this.fetchTags = this.fetchTags.bind(this);
    this.mapTags = this.mapTags.bind(this);
    this.printTags = this.printTags.bind(this);
    this.printTitle = this.printTitle.bind(this);
  }

  componentDidMount(){
    this.fetchTags();
  }

  fetchTags() {
    var URL = 'http://ec2-52-79-46-69.ap-northeast-2.compute.amazonaws.com:9000/';
    // change this url to your server. such as 'localhost:4000'
    var request = (tabs) => {
      chrome.tabs.executeScript( {
        code: "window.getSelection().toString();"
      }, (function(selection) {
        if(selection[0]){
          axios({
            method: "post",
            url: URL + "hashtagger",
            data: {
              text : selection[0]
            }
          })
          .then((response) => {
            console.log(response);
            this.setState({
              title : "이런 태그는 어떠세요?",
              tags : response.data.tags
            });
          })
          .catch((error) => {
            throw error;
            this.setState({
              title : "서버 오류 발생",
              tags : error
            });
          });
        }else {
          this.setState({
            title: "태그를 얻을 글을 드래그 후 버튼을 누르세요."
          });
        }
      }).bind(this));
    };


    chrome.tabs.query({currentWindow: true, active: true}, request.bind(this));
  }

  mapTags() {
    return this.state.tags.map((tag) => {
      return (<p class="tag">{"#" + tag + " "}</p>);
    });
  }

  printTags() {
    if(this.state.tags){
      return (
        <div className="tags">
          {this.mapTags()}
          <p className="footer">Recommended by #HashTagger</p>
        </div>
      );
    } else {
      return (
        <div>
          <ReactSpinner top="50%" left="50%"/>
        </div>
      );
    }
  }

  printTitle() {
    if(this.state.title){
      return (
        <div className="title">
          <h3>{this.state.title}</h3>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <Header />
        <div className="App-intro">
          {this.printTitle()}
          {this.printTags()}
        </div>
      </div>
    );
  }
}

export default App;
