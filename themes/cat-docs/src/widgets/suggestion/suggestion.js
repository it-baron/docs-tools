import PropTypes from 'prop-types';
import SuggestionCardList from './SuggestionCardList';
import preact from 'preact';
import {reportAnalytics} from '../../js/util';

function getPageName() {
  const bodyElements = document.getElementsByClassName('body');
  if (!bodyElements.length) {
    return null;
  }

  const pagename = bodyElements[0].getAttribute('data-pagename');

  return pagename;
}

class Suggestion extends preact.Component {
  constructor(props) {
    super(props);

    this.handleCloseDrawer = this.handleCloseDrawer.bind(this);
    this.handleDismissCard = this.handleDismissCard.bind(this);
    this.pageName = getPageName();

    this.state = {
      isLoaded: false,
      showThankYouMessage: false,
      suggestions: [],
    };
  }

  handleCloseDrawer() {
    this.props.handleCloseDrawer();
    reportAnalytics('Suggestion Drawer Closed', {
      userDismissedSuggestions: this.state.showThankYouMessage,
    });
  }

  handleDismissCard() {
    this.setState({showThankYouMessage: true});
    reportAnalytics('Suggestions Dismissed');
  }

  render() {
    const drawerIsOpen = this.props.drawerIsOpen ? 'is-open' : '';
    const showThankYouMessage = this.state.showThankYouMessage;
    let bodyDisplay; // eslint-disable-line init-declarations

    if (showThankYouMessage) {
      bodyDisplay = (
        <div>
          <span
            onClick={() => this.handleCloseDrawer()}
            class="fa fa-times suggestion-close suggestion-close-button"
          />
          <h1>Thanks for your feedback.</h1>
          <p>
            We&apos;ll use it to make more helpful suggestions in the future.
          </p>
        </div>
      );
    } else {
      bodyDisplay = (
        <div>
          <span
            onClick={() => this.handleCloseDrawer()}
            class="fa fa-times suggestion-close suggestion-close-button"
          />
          <h1>Need help?</h1>
          <p>Other MongoDB users have found these resources useful.</p>
          <SuggestionCardList
            suggestions={this.state.suggestions}
            handleDismissCard={this.handleDismissCard}
            pageName={this.pageName}
          />
        </div>
      );
    }
    return <div className={`suggestion ${drawerIsOpen}`}>{bodyDisplay}</div>;
  }
}

Suggestion.propTypes = {
  drawerIsOpen: PropTypes.bool.isRequired,
  handleCloseDrawer: PropTypes.func.isRequired,
};

export default Suggestion;
