import PropTypes from 'prop-types';
import preact from 'preact';

// State enum
const STATE_INITIAL = 'Initial';
const STATE_VOTED = 'Voted';

class MainWidget extends preact.Component {
    constructor(props) {
        super(props);
        this.state = {
            'closed': false,
            'state': STATE_INITIAL
        };

        this.onSubmitFeedback = this.onSubmitFeedback.bind(this);
        this.onInitialVote = this.onInitialVote.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    componentDidMount() {
        const savedFeedbackState = JSON.parse(window.sessionStorage.getItem('feedbackHidden'));
        if (savedFeedbackState) {
            this.setState({'closed': savedFeedbackState});
        }
    }

    onSubmitFeedback() {
        this.props.onSubmitFeedback(this.state.state);
        this.setState({'state': STATE_VOTED});
    }

    onInitialVote(e, state) {
        window.open('https://discord.gg/yn3fm8bjWU', '_blank');
    }

    toggleVisibility(event) {
        const {closed, state} = this.state;
        event.stopPropagation();
        if ((typeof state === 'boolean' || state === STATE_VOTED) && closed === false) {
            this.setState({'state': STATE_INITIAL});
        }
        this.setState(
            (prevState) => ({'closed': !prevState.closed}),
            () => window.sessionStorage.setItem('feedbackHidden', JSON.stringify(this.state.closed))
        );
    }

    render({children, canShowSuggestions, voteAcknowledgement}, {closed, state}) {
        const delugeBodyClass = (state === STATE_INITIAL)
            ? 'deluge-body'
            : 'deluge-body deluge-body-expanded';
        const delugeHeaderClass = 'deluge-header';
        const delugeClass = (state !== STATE_INITIAL && closed === false)
            ? 'deluge deluge-expanded'
            : 'deluge';

        return (
            <div class={delugeClass}>
                {closed ? (
                    <div class="deluge-header deluge-header-minimized"
                        onClick={this.toggleVisibility}>
                        <span class="fa fa-angle-up deluge-open-icon"></span>
                    </div>
                ) : (
                    <div>
                        <div class={delugeHeaderClass}>
                            <span class="fa fa-angle-down deluge-close-icon-hidden"></span>
                            <span class="deluge-helpful">Need more info?</span>
                            <span class="fa fa-angle-down deluge-close-icon"
                                onClick={this.toggleVisibility}></span>
                        </div>

                        <div class="deluge-vote">
                            <a key="voteup" id="rate-up"
                                onClick={(e) => this.onInitialVote(e, true)}>JOIN DISCORD</a>
                        </div>

                        <div class={delugeBodyClass}>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

MainWidget.propTypes = {
    'error': PropTypes.bool.isRequired,
    'onSubmitFeedback': PropTypes.func.isRequired,
    'onSubmitVote': PropTypes.func.isRequired,
    'onClear': PropTypes.func.isRequired,
    'children': PropTypes.arrayOf(PropTypes.node),
    'voteAcknowledgement': PropTypes.string,
    'handleOpenDrawer': PropTypes.func.isRequired,
    'canShowSuggestions': PropTypes.bool.isRequired
};

export default MainWidget;
