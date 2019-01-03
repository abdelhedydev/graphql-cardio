import uuidv4 from 'uuid/v4'

const Mutattion = {
  createUser: (parent, args, { db }, info) => {
    const emailTaken = db.users.some(user => user.email === args.input.email)
    if (emailTaken) throw new Error('This email is already used')
    const newuser = {
      id: uuidv4(),
      ...args.input
    }
    db.users.push(newuser)
    return newuser
  },
  createPost: (parent, args, { db }, info) => {
    const userExist = db.users.some(user => user.id === args.input.author)
    if (!userExist) throw new Error('User does not exist !')
    const post = {
      id: uuidv4(),
      ...args.input
    }
    db.posts.push(post)
    return post
  },
  createComment: (parent, args, { db }, info) => {
    const { users, posts, comments } = db
    const userExist = users.some(user => user.id === args.input.author)
    const postExist = posts.some(post => post.id === args.input.post)
    const isPublished = (posts.find(post => post.id === args.input.post).published)
    if (!userExist || !postExist || !isPublished) throw new Error('Input Error was founded')
    const newComment = {
      id: uuidv4(),
      ...args.input
    }
    comments.push(newComment)
    return newComment
  },
  deleteUser: (parent, args, { db: { users, comments, posts } }, info) => {
    const user = users.find(user => user.id === args.id)
    if (user.length < 1) {
      throw new Error('Oh user does not exist')
    }
    // Removing user comments
    comments = comments.filter(comment => comment.author !== args.id)

    // Removing user posts
    posts = posts.filter((post) => {
      const match = post.author === args.id
      if (match) {
        comments = comments.filter(comment => comment.post !== post.id)
      }
      return !match
    })

    // Removing user from users
    users = users.filter(u => u.id !== user.id)
    return user
  },
  deletePost: (parent, args, { db }, info) => {
    const postIndex = db.posts.findIndex(post => post.id === args.id)
    if (postIndex === -1) throw new Error('Post does not exist')
    // Removing post Comments
    db.comments = db.comments.filter(comment => comment.post !== args.id)
    // Removing the Post
    const deletedPost = db.posts.splice(postIndex, 1)
    return deletedPost[0]
  },
  deleteComment: (parent, args, { db: { comments } }, info) => {
    const commentIndex = comments.findIndex(comment => comment.id === args.id)
    if (commentIndex === -1) throw new Error('comment does not exist !!')
    const deletedComment = comments.splice(commentIndex, 1)
    return deletedComment[0]
  }
}
export { Mutattion as default }
