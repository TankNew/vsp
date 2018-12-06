const state = () => {
  return {
    currentUser: {
      UserDomain: null,
      UserName: null,
      NickName: null,
      HeadImg: null,
      UserSign: null
    },
    macAddress: null,
    Visitor: null
  }
}

const mutations = {
  setVisitor(state, val) {
    state.Visitor = val || null
  },
  setUser(state, val) {
    state.currentUser = val || null
  },
  setMacAddress(state, val) {
    state.macAddress = val || null
  }
}

const getters = {
  isAuthenticated(state) {
    //用两个!!就可以将变量转化为对应布尔值
    //，如果明确设置了o中flag的值（非 null/undefined/0""/等值），自然test就会取跟o.flag一样的值；如果没有设置，test就会默认为false，而不是 null或undefined。
    return !!state.currentUser
  },
  VisitorInfo(state) {
    return state.Visitor
  },
  currentUser(state) {
    return state.currentUser
  },
  macAddress(state) {
    return state.macAddress
  }
}

const actions = {}
export default {
  state: state,
  mutations: mutations,
  getters: getters,
  actions: actions
}
