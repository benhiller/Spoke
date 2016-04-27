import React, { Component } from 'react'
import { Card, CardTitle, CardText, CardHeader } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'

import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton/IconButton'
import DescriptionIcon from 'material-ui/svg-icons/action/description'

import MenuItem from 'material-ui/MenuItem'

import RaisedButton from 'material-ui/RaisedButton'

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar'
import { MessagesList } from './messages_list'
import { updateSurveyResponse } from '../../api/campaign_contacts/methods'
import { sendMessage } from '../../api/messages/methods'
import { applyScript } from '../helpers/script_helpers'
import { SurveyList } from './survey_list'
import { MessageField } from './message_field'
import { ResponseDropdown } from './response_dropdown'
const styles = {
  heading: {
    padding: 20
  }
}

export class Texter extends Component {
  constructor(props) {
    super(props)

    this.handleSendMessage = this.handleSendMessage.bind(this)
    this.handleSurveyChange = this.handleSurveyChange.bind(this)
  }

  defaultScript(contact) {
    return ''
    const { messages } = this.props

    if (messages.length > 0) {
      return ''
    }

    return applyScript(contact.survey().script, contact)
  }

  handleSendMessage(event) {
    event.preventDefault()
    const input = this.refs.input
    const { contact, assignment } = this.props
    if (input.getValue().trim()) {
      sendMessage.call({
        campaignId: assignment.campaignId,
        contactNumber: contact.number,
        userNumber: "18053959604",
        text: input.getValue()
      }, (error) => {
        if (error) {
            alert(error)
        } else {
          input.value = ''
          // this.goToNextContact()
        }
      })
    }
  }


  handleSurveyChange(event, index, value) {
    console.log("hihihi", value)
    const { answer, surveyQuestionId } = value
    const { contact } = this.props
    console.log("Updating response", surveyQuestionId, contact._id, answer)
    // updateSurveyResponse.call({
    //   campaignSurveyId,
    //   campaignContactId: contact._id
    // })
  }

  renderSurvey() {
    const { assignment, messages, contact, survey } = this.props
    if (messages.length === 0) {
      return ''
    } else {
      return [
        <SurveyList survey={survey}
          onSurveyChange={this.handleSurveyChange} />,
        <Divider />
      ]
    }
  }

  render() {
    const { assignment, messages, contact, survey } = this.props
    console.log(survey)
    const campaign = assignment.campaign()

    return (
      <div>
        <div className="row">
          <div className="col-xs-12 col-sm-3 col-md-2 col-lg-1">
            <div className="box-row">
            </div>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-8 col-lg-10">
              <div className="box-row">
                <Paper>
                  <Toolbar>
                    <ToolbarGroup float="left">
                      <ToolbarTitle text={contact.name} />
                    </ToolbarGroup>
                    <ToolbarGroup float="right">
                      <IconButton touch={true} tooltip={"hello"}>
                        <DescriptionIcon />
                      </IconButton>
                    </ToolbarGroup>
                  </Toolbar>
                  <Divider />

                  <MessagesList messages={messages} />
                  <Divider />
                  {this.renderSurvey()}
                  <MessageField ref="input" script={this.defaultScript(contact)} />
                  <Toolbar>
                    <ToolbarGroup firstChild>
                      <ResponseDropdown />
                    </ToolbarGroup>
                    <ToolbarGroup>
                      <RaisedButton
                        onClick={this.handleSendMessage}
                        label="Send"
                        primary
                      />
                    </ToolbarGroup>
                  </Toolbar>
                </Paper>
              </div>
          </div>
        </div>
      </div>
    )
  }
}

Texter.propTypes = {
  assignment: React.PropTypes.object,      // current assignment
  messages: React.PropTypes.array,   // all assignments for showing in sidebar
  contact: React.PropTypes.object,   // contacts for current assignment
  survey: React.PropTypes.object,   // contacts for current assignment
  campaign: React.PropTypes.object   // contacts for current assignment
}

