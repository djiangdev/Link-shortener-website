import './App.css'
import React, { Component } from 'react'
import Clipboard from 'react-clipboard.js'

export class App extends Component {
  static defaultProps = {
    bitly_host: 'https://api-ssl.bitly.com',
    access_token: 'bd6178d501f8baaf58616c672ab6416105e158d4',
    copy_text: 'Copy to clipboard'
  }

  constructor (props) {
    super(props)
    this.state = {
      short_url: '',
      copy_text: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.getShortenUrl = this.getShortenUrl.bind(this)
    this.onCopySuccess = this.onCopySuccess.bind(this)
  }

  async getShortenUrl (long_url) {
    const response = await fetch(this.props.bitly_host + '/v4/shorten', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.access_token
      },
      body: JSON.stringify({
        long_url: long_url
      })
    })
    return await response.json()
  }

  async handleSubmit (e) {
    e.preventDefault()
    const res = await this.getShortenUrl(e.target[0].value)
    this.setState({
      short_url: res.link,
      copy_text: this.props.copy_text
    })
  }

  onCopySuccess () {
    this.setState({ copy_text: 'Copied' })
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1>Shorten Your URL:</h1>
          <form onSubmit={this.handleSubmit}>
            <input
              type='url'
              className='App-input-text'
              id='input-url'
              required
              placeholder='Enter your long url...'
            />
            <button type='submit' className='App-btn'>
              Shorten
            </button>
          </form>
          {this.state.short_url && (
            <div>
              <code>{this.state.short_url}</code>
              <Clipboard
                className='App-btn-copy'
                data-clipboard-text={this.state.short_url}
                onSuccess={this.onCopySuccess}
              >
                {this.state.copy_text}
              </Clipboard>
            </div>
          )}
        </header>
      </div>
    )
  }
}

export default App
