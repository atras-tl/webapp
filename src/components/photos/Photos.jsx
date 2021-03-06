import React from 'react'
import { fromJS } from 'immutable'
import styled from 'styled-components'
import PropTypes from 'prop-types'
// import { graphql, gql } from 'react-apollo'
import Loading from '../Loading'
import PhotoItem from './PhotoItem'
import { TransitionGroup } from 'react-transition-group'
// import Footer from '../footer/Footer'
import Button from '../button/Button'
// import fetchGirlsQuery from 'AthenaSchema/fetchGirlsQuery.graphql'

const Container = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const PhotoLists = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    &:after {
      content: '';
      flex-grow: 999999999;
    }
`

class Photos extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      currentCell: fromJS({})
    }
  }

  componentDidMount() {
    this.root = document.querySelector('.athena-obs-more')
    this.io = new IntersectionObserver(entries => {
      const e = entries[0]
      if (e.intersectionRatio <= 0 || this.props.loading) {
        return
      }
      this.props.loadMore()
    })
    this.io.observe(this.root)
  }

  componentWillUnmount() {
    this.io.unobserve(this.root)
    this.io.disconnect()
    this.root = null
    this.io = null
  }

  renderPhotos() {
    if (!this.props.cells || this.props.cells.length === 0) {
      return null
    }
    return this.props.cells.map(pic => {
      return (
        <PhotoItem
          key={pic.id}
          id={pic.id}
          src={pic.img}
          desc={pic.text}
          fromID={pic.fromID}
          fromURL={pic.fromURL}
          content={pic.content}
          forceDeleteable={this.props.forceDeleteable}
        />
      )
    })
  }

  render() {
    return (
      <Container>
        <TransitionGroup
          component={PhotoLists}
          classNames="fade"
          timeout={{
            exit: 350,
            enter: 350
          }}
        >
          {this.renderPhotos()}
        </TransitionGroup>
        <Button
          size="large"
          color="red"
          disabled={this.props.loading}
          className="athena-obs-more"
          onClick={this.props.loadMore}
        >Load More </Button>
        {this.props.loading && (<Loading />)}
      </Container>
    )
  }
}

Photos.propTypes = {
  cells: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    img: PropTypes.string,
    text: PropTypes.string
  })),
  loading: PropTypes.bool,
  loadMore: PropTypes.func.isRequired,
  forceDeleteable: PropTypes.bool
}

export default Photos
