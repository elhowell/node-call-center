import React from 'react'
import {Spacing} from '@bandwidth/shared-components'
import {getPools, createPool, updatePool, removePool, CREATE_POOL_SET_AREA_CODE, CREATE_POOL_SET_FORWARDS, CREATE_POOL_SET_GREETING, UPDATE_POOL_SET_FORWARDS, UPDATE_POOL_SET_GREETING, SET_POOL_ID} from '../store/pools'

class Pools extends React.Component {
	columns = [
    {name: 'phoneNumber', displayName: 'Number'},
		{name: 'greeting', displayName: 'Greeting'},
		{name: 'forwards', displayName: 'Agent Numbers'},
		{name: 'actions', displayName: ''}
	]

	componentWillMount() {
		this.props.getPools()
	}

	renderRow(item) {
		return (<Table.Row key={item.id}>
			<Table.Cell>{item.phoneNumber}</Table.Cell>
			<Table.Cell>{item.greeting && '(default)'}</Table.Cell>
			<Table.Cell>{(item.forwards || []).join(', ')}</Table.Cell>
			<Table.Cell><Button onClick={ev => this.props.removeButton(ev, item.id)}>Remove</Button><Button onClick={ev => this.props.showCalls(ev, item.id)}>Calls</Button></Table.Cell>
		</Table.Row>)
	}

	renderDetails(item) {
		return (<Form onSubmit={ev => updatePool(ev)}>
					<FlexFields>
						<TextField
							label="Agents phone numbers"
							name="forwarders"
							type="text"
							input={{
								value: (updatePool.forwarders || []).join(', '),
								onChange: ev => updatePoolSetForwards(ev.target.value)
							}}
							required
						/>
						<TextField
							label="Greeting text"
							name="greeting"
							type="text"
							input={{
								value: updatePool.greeting,
								onChange: ev => updatePoolSetGreeting(ev.target.value)
							}}
						/>
					</FlexFields>
					<SubmitButtonField loading={updating}>Save</SubmitButtonField>
				</Form>)
	}

	render() {
		const {error, loading, creating, createPool, updatePool, pools, createPoolSetAreaCode, createPoolSetForwards} = this.props
		const renderRow = this.renderRow.bind(this)
		const renderDetails = this.renderDetails.bind(this)
		return (
			<Spacing>
				{error && <Alert type="error">{error}</Alert>}
				<Form onSubmit={ev => createPool(ev)}>
					<FlexFields>
						<TextField
							label="Area code for phone number to reserve"
							name="areacode"
							type="text"
							input={{
								value: createPool.areaCode,
								onChange: ev => createPoolSetAreaCode(ev.target.value)
							}}
							required
						/>
						<TextField
							label="Agents phone numbers to forward calls (comma separated)"
							name="forwarders"
							type="text"
							input={{
								value: (createPool.forwarders || []).join(', '),
								onChange: ev => createPoolSetForwards(ev.target.value)
							}}
							required
						/>
						<TextField
							label="Greeting text"
							name="greeting"
							type="text"
							input={{
								value: createPool.greeting,
								onChange: ev => createPoolSetGreeting(ev.target.value)
							}}
						/>
					</FlexFields>
					<SubmitButtonField loading={creating}>Create Pool</SubmitButtonField>
				</Form>
				<Spacing/>
				<Table.Simple items={pools} columns={this.columns} renderRow={renderRow} renderDetails={renderDetails} loading={loading}>
				</Table.Simple>
			</Spacing>
		)
	}
}

export default connect(
	state => ({
		pools: state.pools.pools || [],
		createPoolNumber: state.pools.createPoolNumber,
		error: state.pools.error,
		loading: state.pools.loading,
		creating: state.pools.creating
	}),
	dispatch => ({
		updatePool: (ev, id) => {
			ev.preventDefault()
			ev.stopPropagation()
			dispatch({type: SET_POOL_ID, id: id})
			dispatch(updatePool(id))
		},
		removePool: (ev, id) => {
			ev.preventDefault()
			ev.stopPropagation()
			if (window.confirm('Are you sure?')) {
				dispatch({type: SET_POOL_ID, id: id})
				dispatch(removePool(id))
			}
		},
		createPoolSetAreaCode: areaCode => {
			dispatch({type: CREATE_POOL_SET_AREA_CODE, areaCode})
		},
		createPoolSetGreeting: greeting => {
			dispatch({type: CREATE_POOL_SET_GREETING, greeting})
		},
		createPoolSetForwards: forwards => {
			dispatch({type: CREATE_POOL_SET_FORWARDS, forwards})
		},
		updatePoolSetGreeting: greeting => {
			dispatch({type: UPDATE_POOL_SET_GREETING, greeting})
		},
		updatePoolSetForwards: forwards => {
			dispatch({type: UPDATE_POOL_SET_FORWARDS, forwards})
		},
		getPools: () => dispatch(getPools()),
		createPool: ev => {
			dispatch(createPool())
			ev.preventDefault()
		},
		showCalls: (ev, id) => {
			dispatch(push(`/calls?pool=${id}`))
			ev.preventDefault()
		}
	})
)(Pools)