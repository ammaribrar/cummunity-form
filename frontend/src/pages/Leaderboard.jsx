import { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Divider,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Whatshot as HotIcon,
  ChatBubble as ChatBubbleIcon,
  ThumbUp as ThumbUpIcon,
  Article as ArticleIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [timeRange, setTimeRange] = useState('all');
  const [leaderboardType, setLeaderboardType] = useState('reputation');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  
  // Time range options
  const timeRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'month', label: 'This Month' },
    { value: 'week', label: 'This Week' },
    { value: 'day', label: 'Today' },
  ];
  
  // Leaderboard type options
  const leaderboardTypes = [
    { value: 'reputation', label: 'Reputation', icon: <StarIcon fontSize="small" /> },
    { value: 'posts', label: 'Posts', icon: <ArticleIcon fontSize="small" /> },
    { value: 'comments', label: 'Comments', icon: <ChatBubbleIcon fontSize="small" /> },
    { value: 'likes', label: 'Likes', icon: <ThumbUpIcon fontSize="small" /> },
  ];

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you would fetch from your API:
      // const response = await axios.get(`/api/leaderboard?timeRange=${timeRange}&type=${leaderboardType}`);
      // setUsers(response.data);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      const mockUsers = [
        {
          id: 1,
            username: 'user1',
            avatar: 'https://i.pravatar.cc/150?img=1',
            reputation: 1250,
            posts: 42,
            comments: 128,
            votes: 356,
            rank: 1
          },
          {
            id: 2,
            username: 'user2',
            avatar: 'https://i.pravatar.cc/150?img=2',
            reputation: 980,
            posts: 35,
            comments: 95,
            votes: 289,
            rank: 2
          },
          // Add more mock users as needed
        ];

        // In a real app, you would use:
        // const response = await axios.get('/api/leaderboard', {
        //   params: {
        //     type: leaderboardType,

      // For now, use mock data
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLeaderboard();
  }, [timeRange, leaderboardType]);
  
  // Apply filters and sorting
  useEffect(() => {
    if (!users.length) return;
    
    let result = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'username':
          comparison = a.username.localeCompare(b.username);
          break;
        case 'reputation':
          comparison = b.reputation - a.reputation;
          break;
        case 'posts':
          comparison = b.posts - a.posts;
          break;
        case 'comments':
          comparison = b.comments - a.comments;
          break;
        case 'votes':
          comparison = b.votes - a.votes;
          break;
        default:
          comparison = a.rank - b.rank;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredUsers(result);
    setPage(0); // Reset to first page when filters change
  }, [users, searchQuery, sortBy, sortOrder]);
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle time range change
  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };
  
  // Handle leaderboard type change
  const handleLeaderboardTypeChange = (event, newType) => {
    if (newType !== null) {
      setLeaderboardType(newType);
    }
  };
  
  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getLeaderboardTitle = () => {
    const typeMap = {
      reputation: 'Reputation',
      posts: 'Top Posters',
      comments: 'Top Commenters',
      votes: 'Most Helpful',
    };

    const rangeMap = {
      all: 'All Time',
      month: 'This Month',
      week: 'This Week',
      day: 'Today',
    };

    return `${typeMap[leaderboardType]} Leaderboard - ${rangeMap[timeRange]}`;
  };

  const getLeaderboardDescription = () => {
    const descriptions = {
      reputation: 'Users with the highest reputation scores based on their contributions.',
      posts: 'Most active users by number of posts created.',
      comments: 'Users who have contributed the most comments.',
      votes: 'Users whose posts and comments received the most upvotes.',
    };
    return descriptions[leaderboardType] || '';
  };

  const getLeaderboardIcon = () => {
    switch (leaderboardType) {
      case 'reputation':
        return <StarIcon color="primary" sx={{ fontSize: 40 }} />;
      case 'posts':
        return <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />;
      case 'comments':
        return <ChatBubbleIcon color="primary" sx={{ fontSize: 40 }} />;
      case 'votes':
        return <ThumbUpIcon color="primary" sx={{ fontSize: 40 }} />;
      default:
        return <TrophyIcon color="primary" sx={{ fontSize: 40 }} />;
    }
  };

  const getLeaderboardValue = (user) => {
    switch (leaderboardType) {
      case 'reputation':
        return user.reputation || 0;
      case 'posts':
        return user.postCount || 0;
      case 'comments':
        return user.commentCount || 0;
      case 'votes':
        return user.votesReceived || 0;
      default:
        return 0;
    }
  };

  const getLeaderboardLabel = () => {
    switch (leaderboardType) {
      case 'reputation':
        return 'Reputation';
      case 'posts':
        return 'Posts';
      case 'comments':
        return 'Comments';
      case 'votes':
        return 'Votes';
      default:
        return 'Score';
    }
  };

  const getRankBadge = (index) => {
    if (page * rowsPerPage + index === 0) {
      return (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: 'gold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
            fontWeight: 'bold',
            mr: 1,
          }}
        >
          1
        </Box>
      );
    } else if (page * rowsPerPage + index === 1) {
      return (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: 'silver',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
            fontWeight: 'bold',
            mr: 1,
          }}
        >
          2
        </Box>
      );
    } else if (page * rowsPerPage + index === 2) {
      return (
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: '#cd7f32', // Bronze
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            mr: 1,
          }}
        >
          3
        </Box>
      );
    } else {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ width: 24, textAlign: 'center', mr: 1 }}>
          {page * rowsPerPage + index + 1}
        </Typography>
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 2 }}>
          {getLeaderboardIcon()}
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          {getLeaderboardTitle()}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          {getLeaderboardDescription()}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <ToggleButtonGroup
            value={leaderboardType}
            exclusive
            onChange={handleLeaderboardTypeChange}
            aria-label="leaderboard type"
            size={isMobile ? 'small' : 'medium'}
            color="primary"
          >
            <ToggleButton value="reputation" aria-label="reputation">
              <StarIcon sx={{ mr: 1 }} /> Reputation
            </ToggleButton>
            <ToggleButton value="posts" aria-label="top posters">
              <TrendingUpIcon sx={{ mr: 1 }} /> Top Posters
            </ToggleButton>
            <ToggleButton value="comments" aria-label="top commenters">
              <ChatBubbleIcon sx={{ mr: 1 }} /> Top Commenters
            </ToggleButton>
            <ToggleButton value="votes" aria-label="most helpful">
              <ThumbUpIcon sx={{ mr: 1 }} /> Most Helpful
            </ToggleButton>
          </ToggleButtonGroup>
          
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="time range"
            size={isMobile ? 'small' : 'medium'}
            color="primary"
          >
            <ToggleButton value="day" aria-label="today">
              Today
            </ToggleButton>
            <ToggleButton value="week" aria-label="this week">
              This Week
            </ToggleButton>
            <ToggleButton value="month" aria-label="this month">
              This Month
            </ToggleButton>
            <ToggleButton value="all" aria-label="all time">
              All Time
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      
      <Paper elevation={2} sx={{ mb: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell align="right">{getLeaderboardLabel()}</TableCell>
                    <TableCell align="right">Posts</TableCell>
                    <TableCell align="right">Comments</TableCell>
                    <TableCell align="right">Reputation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user, index) => (
                      <TableRow 
                        key={user._id || `user-${index}`}
                        hover
                        sx={{
                          '&:hover': {
                            bgcolor: 'action.hover',
                            cursor: 'pointer'
                          },
                        }}
                        onClick={() => navigate(`/profile/${user.username}`)}
                      >
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getRankBadge(index)}
                            {page * rowsPerPage + index < 3 && (
                              <TrophyIcon 
                                color={index === 0 ? 'gold' : index === 1 ? 'silver' : '#cd7f32'}
                                sx={{ fontSize: 20, ml: 1 }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={user.avatar} 
                              alt={user.username}
                              sx={{ width: 32, height: 32, mr: 1.5 }}
                            />
                            <Box>
                              <Typography variant="body1" color="text.primary">
                                {user.username}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {user.name}
                              </Typography>
                            </Box>
                            {user.role === 'admin' && (
                              <Chip 
                                label="Admin" 
                                size="small" 
                                color="secondary" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography variant="body1" fontWeight="medium">
                              {getLeaderboardValue(user).toLocaleString()}
                            </Typography>
                            {leaderboardType === 'reputation' && user.reputationChange && (
                              <Chip 
                                label={`${user.reputationChange > 0 ? '+' : ''}${user.reputationChange}`}
                                size="small"
                                color={user.reputationChange > 0 ? 'success' : 'error'}
                                sx={{ ml: 1, height: 20 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Posts" arrow>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <ArticleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {(user.postCount || 0).toLocaleString()}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Comments" arrow>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <ChatBubbleIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {(user.commentCount || 0).toLocaleString()}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Reputation" arrow>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <StarIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {(user.reputation || 0).toLocaleString()}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          How the Scoring Works
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Reputation Points
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li><Typography variant="body2">+10 points for each upvote on your post</Typography></li>
              <li><Typography variant="body2">+5 points for each upvote on your comment</Typography></li>
              <li><Typography variant="body2">+2 points for each upvote you give</Typography></li>
              <li><Typography variant="body2">-2 points for each downvote on your content</Typography></li>
              <li><Typography variant="body2">+50 points for accepted answer</Typography></li>
            </ul>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Badges & Achievements
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip 
                icon={<TrophyIcon style={{ color: 'gold' }} />} 
                label="Gold" 
                size="small" 
                variant="outlined"
              />
              <Chip 
                icon={<TrophyIcon style={{ color: 'silver' }} />} 
                label="Silver" 
                size="small" 
                variant="outlined"
              />
              <Chip 
                icon={<TrophyIcon style={{ color: '#cd7f32' }} />} 
                label="Bronze" 
                size="small" 
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Earn badges for your contributions and achievements in the community.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Leaderboard;
