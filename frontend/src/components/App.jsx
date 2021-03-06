import React from 'react'
import {Route} from 'react-router'
import {ConnectedRouter} from 'react-router-redux'
import {BandwidthThemeProvider, Navigation, Page, Spacing} from '@bandwidth/shared-components'

import {history} from '../store/createStore'
import {connect} from 'react-redux'

import {getProfile} from '../store/profile'
import {logout} from '../store/login'

import Pools from './Pools.jsx'
import Calls from './Calls.jsx'

class App extends React.Component {
	componentWillMount() {
		this.props.getProfile()
	}
	render() {
		if (!this.props.profile.loaded) {
			return (null)
		}
		const links = []
		const isLoggedIn = this.props.profile.id
		const goToLogin = ev => {
			window.location.href = '/login'
			ev.preventDefault()
		}
		if (isLoggedIn) {
			links.push({to: '/', exact: true, content: 'Pools'})
			links.push({to: '/pool-calls', content: 'Calls'})
			links.push({to: '#', content: 'Logout', onClick: ev => {
				this.props.logout().then(() => this.props.getProfile()).then(() => history.push('/login'))
				ev.preventDefault()
			}})
		} else {
			links.push({to: '#', exact: true, content: 'Login', onClick: goToLogin})
		}
		return (
			<BandwidthThemeProvider>
				<ConnectedRouter history={history}>
					<div>
						<Navigation
								title="Call center"
								links={links}
							/>
						<Page>
							<Spacing>
								<Route path="/pool-calls" component={Calls}/>
								<Route exact={true} path="/" component={Pools}/>
							</Spacing>
						</Page>
					</div>
				</ConnectedRouter>
			</BandwidthThemeProvider>
		)
	}
}

export default connect(
	state => ({
		profile: state.profile
	}),
	dispatch => ({
		getProfile: password => dispatch(getProfile()),
		logout: () => dispatch(logout())
	})
)(App)

