import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import PhotoList from 'AthenaComponents/photos/Photos'
import fetchGirlsQuery from 'AthenaSchema/fetchGirlsQuery.graphql'
import { randomCategory } from '../../constants/defaults'

const Container = styled.main`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const gqlProps = {
  options: props => ({
    variables: {
      from: props.categoryID, take: 20, offset: 0,
      hideOnly: false
    },
    fetchPolicy: 'cache-and-network'
  }),
  props({ data: { girls, loading, fetchMore, variables }, ownProps: { categories} }) {
    return {
      girls,
      loading,
      categories,
      loadMore() {
        // if is random category, just random params
        let from = variables.from
        let offset = girls.length
        if (from === randomCategory.id) {
          const randomIndexItem = Math.floor(Math.random() * (categories.size - 1))
          from = categories.getIn([randomIndexItem, 'id'])
          offset = Math.floor(Math.random() * (categories.getIn([randomIndexItem, 'count']) - variables.take))
          offset = offset < 0 ? 0 : offset
        }
        return fetchMore({
          fetchGirlsQuery,
          variables: {
            from, take: variables.take, offset,
            hideOnly: false
          },
          updateQuery: (pResult, { fetchMoreResult }) => {
            return {
              girls: pResult.girls.concat(fetchMoreResult.girls)
            }
          }
        })
      },
      loadNewCategories(from) {
        // if is random category, just random params
        let offset = 0
        if (from === randomCategory.id) {
          const randomIndexItem = Math.floor(Math.random() * (categories.size - 1))
          from = categories.getIn([randomIndexItem, 'id'])
          offset = Math.floor(Math.random() * (categories.getIn([randomIndexItem, 'count'])- variables.take))
        }
        return fetchMore({
          fetchGirlsQuery,
          variables: { from, take: variables.take, offset },
          updateQuery(pResult, { fetchMoreResult }) {
            return {
              variables: { ...variables, from, offset: 20 },
              girls: fetchMoreResult.girls
            }
          }
        })
      }

    }
  }
}

@connect(store => ({ categories: store.getIn(['app', 'categories']) }))
@graphql(fetchGirlsQuery, gqlProps)
class Photos extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(np) {
    if (np.categoryID !== this.props.categoryID) {
      this.props.loadNewCategories(np.categoryID)
    }
  }

  render() {
    const { loading, loadMore, girls } = this.props
    return (
      <Container>
        <PhotoList
          loading={loading}
          loadMore={loadMore}
          cells={girls}
        />
      </Container>
    )
  }
}

Photos.propTypes = {
  loading: PropTypes.bool,
  categories: PropTypes.arrayOf(PropTypes.any),
  girls: PropTypes.arrayOf(PropTypes.any),
  loadMore: PropTypes.func,
  loadNewCategories: PropTypes.func,
  categoryID: PropTypes.number
}

export default Photos
