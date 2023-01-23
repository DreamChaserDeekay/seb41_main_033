import styled from "styled-components";
import SearchBar from "./../components/SearchBar";
import StorySingle from "../components/StorySingle";
import WriteFloatButton from "../components/WriteFloatButton";
import { useEffect, useState, useRef, createRef } from "react";
import axios from "axios";
import { API_URL } from "../data/apiUrl";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";

const Wrap = styled.div`
	.loadingObserver {
		> div {
			width: 100%;
			height: 140px;
			margin-bottom: 24px;
			border-radius: var(--border-radius-lg);
			background: var(--darkgrey1);
			animation: loading_skeleton 1.2s linear infinite;
		}
	}

	@keyframes loading_skeleton {
		0% {
			background: var(--darkgrey1);
		}
		50% {
			background: var(--darkgrey2);
		}
		100% {
			background: var(--darkgrey1);
		}
	}
`;

const TitleWrap = styled.div`
	display: flex;
	margin-bottom: 32px;
	h3 {
		margin-right: 24px;
		letter-spacing: -0.5px;
		font-size: var(--font-head2-size);
	}
	h3.active {
		font-weight: var(--font-weight-medium);
		color: var(--primary-color);
	}
`;

const StoryBoardWrap = styled.div`
	margin-top: 48px;
	> div {
		margin-bottom: 24px;
	}
`;

const Story = () => {
	const loginInfo = useSelector((state) => state.islogin.login);
	const accessToken = loginInfo.accessToken;
	const navigate = useNavigate();
	const [storyData, setStoryData] = useState([]);

	//고도화 필요
	//두 번씩 로딩되는게 react.strictMode 때문인가... 일단 보류
	//총 페이지 제한해서 마지막 페이지면 로딩 안보이게 하기

	//페이지 로딩 state
	const [page, setPage] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const pageEndPoint = useRef();
	//페이지 증가 함수
	const addPage = () => {
		setPage((prevPage) => {
			return prevPage + 1;
		});
	};
	//페이지 요청 함수
	const requestPage = async (page) => {
		await axios
			.get(`${API_URL}/api/boards?page=${page}`, {
				// headers: {
				// 	// "ngrok-skip-browser-warning": "69420",
				// 	Authorization: `Bearer ${accessToken}`,
				// },
			})
			.then((res) => {
				setStoryData((prevData) => [...prevData, ...res.data.data]);
				setIsLoading(true);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	//페이지 바뀔때마다 데이터 요청
	useEffect(() => {
		requestPage(page);
	}, [page]);

	//Intersection Observer로 로딩 여부 확인
	useEffect(() => {
		if (isLoading) {
			//로딩시 페이지 추가
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						addPage();
					}
				},
				{ threshold: 0.4 }
			);
			//옵저버 탐색
			observer.observe(pageEndPoint.current);
		}
	}, [isLoading]);

	const handleWriteFBtnOnClick = () => {
		navigate(`/storywrite`);
	};
	return (
		<Wrap>
			<TitleWrap>
				<h3 className="active">모두의 스토리</h3>
				<h3>친구의 스토리</h3>
			</TitleWrap>
			<SearchBar />
			<StoryBoardWrap>
				{storyData?.map((el, idx) => {
					return <StorySingle key={idx} data={el} />;
				})}
			</StoryBoardWrap>
			<WriteFloatButton click={handleWriteFBtnOnClick} />
			{/* {isLoading && <Loading ref={pageEndPoint} />} */}
			{isLoading && (
				<div className="loadingObserver" ref={pageEndPoint}>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			)}
		</Wrap>
	);
};
export default Story;
