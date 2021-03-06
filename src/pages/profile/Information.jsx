import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { defaultAvatar } from '../../constants/defaults'
import { LOGOUT } from '../../constants/auth'

const Container = styled.section`
  display: flex;
`

const Avatar = styled.div`
  margin-right: 2rem;
  img {
    border-radius: 4px;
    width: 10rem;
    height: 10rem;
  }
`

const Infos = styled.div`
`

const InfoItem = styled.div`
  padding: .5rem 0;
  span:first-child {
    color: #888;
  }
`

const schemaCanShow = [{
  column: 'email',
  name: 'Email'
}, {
  column: 'name',
  name: 'Name'
}, {
  column: 'bio',
  name: 'Bio'
}]

@connect(null, dispatch => ({
  logout() { return dispatch({ type: LOGOUT })}
}))
class Information extends React.PureComponent {
  render() {
    const { user } = this.props
    const _avatar = user.get('avatar')
    const avatarUrl = (_avatar && _avatar !== 'null') ? _avatar : defaultAvatar
    return (
      <Container>
        <Avatar>
          <img src={avatarUrl} />
        </Avatar>
        <Infos>
          {schemaCanShow.map((x, i) => (
            <InfoItem key={i}>
              <span>{x.name}: </span>
              <span>{user.get(x.column)}</span>
            </InfoItem>
          )).concat((
            <InfoItem key={schemaCanShow.length + 1}>
              <button onClick={() => { this.props.logout() }}>logout</button>
            </InfoItem>
          ))}
        </Infos>
      </Container>
    )
  }
}

Information.propTypes = {
  logout: PropTypes.func,
  user: PropTypes.any
}

export default Information
