import FreeformQuestion from './FreeformQuestion';
import InputField from './InputField';
import MainWidget from './MainWidget';
import PropTypes from 'prop-types';
import preact from 'preact';

const MIN_CHAR_COUNT = 15;
const MIN_CHAR_ERROR_TEXT = `Please respond with at least ${MIN_CHAR_COUNT} characters.`;
const EMAIL_ERROR_TEXT = 'Please enter a valid email address.';
const EMAIL_PROMPT_TEXT = 'May we contact you about your feedback?';

class Deluge extends preact.Component {
  constructor(props) {
    super(props);

    const crypto = window.crypto || window.msCrypto;
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);

    this.state = {
      answers: {},
      emailError: false,
      interactionId: btoa(
        Array.prototype.map.call(buf, ch => String.fromCharCode(ch)).join('')
      ).slice(0, -2),
      voteAcknowledgement: null,
    };
    this.onSubmitFeedback = this.onSubmitFeedback.bind(this);
    this.onSubmitVote = this.onSubmitVote.bind(this);
  }

  sendAnalytics(eventName, eventObj) {
    try {
      const user = window.analytics.user();
      const segmentUID = user.id();
      if (segmentUID) {
        eventObj.segmentUID = segmentUID.toString();
      } else {
        eventObj.segmentAnonymousID = user.anonymousId().toString();
      }
      window.analytics.track(eventName, eventObj);
    } catch (err) {
      console.error(err);
    }
    return eventObj;
  }

  onSubmitVote(vote) {
    this.sendVote(vote)
      .then(result => {
        this.setState({
          voteAcknowledgement: vote ? 'up' : 'down',
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  sendVote(vote) {}

  onSubmitFeedback(vote) {
    const fields = {};

    const answers = this.state.answers;
    const keys = Object.keys(answers);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      // Report booleans and non-empty strings
      if (answers[key] || answers[key] === false) {
        fields[key] = answers[key];
      }
    }

    this.sendFeedback(vote, fields).catch(err => {
      console.error(err);
    });
  }

  sendFeedback(vote, fields) {}

  makeStore(key) {
    return {
      get: () => this.state.answers[key],
      set: val =>
        this.setState(prevState => ({
          answers: {
            ...prevState.answers,
            [key]: val,
          },
        })),
    };
  }

  validateEmail(input) {
    const hasError = !(
      input === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
    );
    this.setState({emailError: hasError});
    return hasError;
  }

  render(props, {voteAcknowledgement}) {
    const noAnswersSubmitted =
      Object.keys(this.state.answers).length === 0 ||
      Object.values(this.state.answers).every(val => val === '');
    const hasError = noAnswersSubmitted || this.state.emailError;
    return (
      <MainWidget
        voteAcknowledgement={voteAcknowledgement}
        onSubmitFeedback={this.onSubmitFeedback}
        onSubmitVote={this.onSubmitVote}
        onClear={() => this.setState({answers: {}})}
        canShowSuggestions={props.canShowSuggestions}
        i
        handleOpenDrawer={props.handleOpenDrawer}
        error={hasError}
      >
        <FreeformQuestion
          errorText={MIN_CHAR_ERROR_TEXT}
          store={this.makeStore('reason')}
          placeholder="What are you trying to do?"
        />
        <div className="caption">{EMAIL_PROMPT_TEXT}</div>
        <InputField
          errorText={EMAIL_ERROR_TEXT}
          hasError={input => this.validateEmail(input)}
          inputType={'email'}
          store={this.makeStore('email')}
          placeholder="Email address"
        />
      </MainWidget>
    );
  }
}

Deluge.propTypes = {
  project: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  canShowSuggestions: PropTypes.bool.isRequired,
  handleOpenDrawer: PropTypes.func.isRequired,
};

export default Deluge;
