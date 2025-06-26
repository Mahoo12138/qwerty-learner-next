import type React from "react";
import { Link } from "@tanstack/react-router";
import Header from "@/components/Header";
import { Book, AlertCircle, BarChart2, Calendar } from "lucide-react";
import { Box, Stack, Typography, Button, Card, CardContent, Divider, Grid } from '@mui/joy';

const Home: React.FC = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "早上好";
    if (hour < 18) return "下午好";
    return "晚上好";
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.body' }}>
      <Header />
      <Stack alignItems="center" sx={{ mt: 12 }}>
        <Typography level="h2" sx={{ fontSize: 40, fontWeight: 700, mb: 3 }}>
          {getGreeting()}
        </Typography>
        <Typography level="body-lg" sx={{ color: 'text.secondary', mb: 3 }}>
          准备好开始今天的打字练习了吗？
        </Typography>
        <Button
          component={Link}
          to="/typing"
          size="lg"
          variant="solid"
          color="primary"
          sx={{ fontSize: 20, px: 6, py: 2, borderRadius: 8, mb: 6 }}
        >
          开始练习
        </Button>
      </Stack>
      <Grid container spacing={3} sx={{ maxWidth: 900, mx: 'auto', mt: 2 }}>
        <Grid xs={12} sm={6}>
          <Card
            variant="soft"
            sx={{ height: 132, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', ':hover': { boxShadow: 'lg', '& .MuiSvgIcon-root': { color: 'primary.500' }, '& .MuiTypography-root': { color: 'primary.700' } }, transition: 'box-shadow 0.3s' }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                <Typography level="h4" sx={{ mb: 1 }}>
                  词库
                </Typography>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  管理你的词库，添加新的单词和短语
                </Typography>
              </Box>
              <Button component={Link} to="/dictionary" variant="plain" color="neutral" sx={{ p: 0, minWidth: 0, alignSelf: 'flex-end' }}>
                <Book size={48} style={{ transition: 'color 0.3s' }} />
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6}>
          <Card
            variant="soft"
            sx={{ height: 132, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', ':hover': { boxShadow: 'lg', '& .MuiSvgIcon-root': { color: 'primary.500' }, '& .MuiTypography-root': { color: 'primary.700' } }, transition: 'box-shadow 0.3s' }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                <Typography level="h4" sx={{ mb: 1 }}>
                  错题本
                </Typography>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  查看和复习你经常出错的单词
                </Typography>
              </Box>
              <Button component={Link} to="/mistake" variant="plain" color="neutral" sx={{ p: 0, minWidth: 0, alignSelf: 'flex-end' }}>
                <AlertCircle size={48} style={{ transition: 'color 0.3s' }} />
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6}>
          <Card
            variant="soft"
            sx={{ height: 132, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', ':hover': { boxShadow: 'lg', '& .MuiSvgIcon-root': { color: 'primary.500' }, '& .MuiTypography-root': { color: 'primary.700' } }, transition: 'box-shadow 0.3s' }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                <Typography level="h4" sx={{ mb: 1 }}>
                  统计
                </Typography>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  查看你的练习数据和进步情况
                </Typography>
              </Box>
              <Button component={Link} to="/statistic" variant="plain" color="neutral" sx={{ p: 0, minWidth: 0, alignSelf: 'flex-end' }}>
                <BarChart2 size={48} style={{ transition: 'color 0.3s' }} />
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6}>
          <Card
            variant="soft"
            sx={{ height: 132, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', ':hover': { boxShadow: 'lg', '& .MuiSvgIcon-root': { color: 'primary.500' }, '& .MuiTypography-root': { color: 'primary.700' } }, transition: 'box-shadow 0.3s' }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                <Typography level="h4" sx={{ mb: 1 }}>
                  练习计划
                </Typography>
                <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                  制定和跟踪你的练习计划
                </Typography>
              </Box>
              <Button component={Link} to="/plan" variant="plain" color="neutral" sx={{ p: 0, minWidth: 0, alignSelf: 'flex-end' }}>
                <Calendar size={48} style={{ transition: 'color 0.3s' }} />
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
