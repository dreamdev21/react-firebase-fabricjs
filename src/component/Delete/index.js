import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as Controller from '../../lib/controller'
require('./index.css')

export default class DeleteForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    static propTypes = {
        onDelete: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        isProject: PropTypes.bool,
        isShared: PropTypes.bool,
        name: PropTypes.string,
        type: PropTypes.string
    }

    static defaultProps = {
        onDelete: () => undefined,
        onCancel: () => undefined,
        isProject: false,
        isShared: false
    }

    render() {
        return (
			
			<div role="document" className="medium-width">
				<form id="delete-project" className="minimal-form">
                    {
                        this.props.type === 'comment'?
                        <fieldset>
                            <legend id="dialogTitle" tabIndex="0">Delete Comment?</legend>
                            <p>Are you sure you want to delete this comment?</p>
                            <p className="multiple-button">
                                <button type="submit" onClick={() => this.props.onDelete()}>Yes, Delete It</button>
                                <button className="cancel" type="button" onClick={() => this.props.onCancel()}>CANCEL</button>
                            </p>
                        </fieldset>
                        :this.props.type === 'reply'?
                        <fieldset>
                            <legend id="dialogTitle" tabIndex="0">Delete Reply?</legend>
                            <p>Are you sure you want to delete this reply?</p>
                            <p className="multiple-button">
                                <button type="submit" onClick={() => this.props.onDelete()}>Yes, Delete It</button>
                                <button className="cancel" type="button" onClick={() => this.props.onCancel()}>CANCEL</button>
                            </p>
                        </fieldset>
                        :this.props.isShared?
                        <fieldset>
                            <legend id="dialogTitle" tabIndex="0">Delete Shared Project?</legend>
                            <p>Are you sure that you want to delete <strong>{Controller.myDecode(this.props.name)}</strong> from your shared list?</p>
                            <p className="multiple-button">
                                <button type="submit" onClick={() => this.props.onDelete()}>Yes, Delete It</button>
                                <button className="cancel" type="button" onClick={() => this.props.onCancel()}>CANCEL</button>
                            </p>
                        </fieldset>
                        :<fieldset>
                            <legend id="dialogTitle" tabIndex="0">{this.props.isProject?'Delete Project?':'Delete Item?'}</legend>
                            <p>Are you sure that you want to delete <strong>{Controller.myDecode(this.props.name)}</strong>?</p>
                            <p>All items, annotations and comments in this project will be deleted as well.</p>
                            <p className="multiple-button">
                                <button type="submit" onClick={() => this.props.onDelete()}>Yes, Delete It</button>
                                <button className="cancel" type="button" onClick={() => this.props.onCancel()}>CANCEL</button>
                            </p>
                        </fieldset>
                    }
				</form>	
			</div>
        );
    }
}