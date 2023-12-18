import { post } from '../../api/axios';

import { API_ROUTES } from '../../api/routes';

export const authApi = async ({ login }) => {
    try {
        const response = await post(API_ROUTES.login, JSON.stringify(login), {
            headers: { 'Content-Type': 'application/json' },
        });

        return response.data;
    } catch (err) {
        console.error(err);
        return Promise.reject(err);
    }
};

export const authInfoApi = async (requestAuth) => {
    try {
        const response = await requestAuth.get(API_ROUTES.info);

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const contractsApi = async (requestAuth, status) => {
    try {
        const response = await requestAuth.get('/contract/by_enterprise_auth', {
            params: {
                status: status,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const contractsApprovedApi = async (requestAuth, status) => {
    try {
        const response = await requestAuth.get('/contract/by_enterprise_auth', {
            params: {
                status: status,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const updateContractApi = async (requestAuth, data) => {
    try {
        const response = await requestAuth.put(
            '/contract/update',
            JSON.stringify(data),
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const updateStatusContractApi = async (requestAuth, data) => {
    try {
        const response = await requestAuth.put(
            '/contract/update_status',
            JSON.stringify(data),
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const contractsAllApi = async (requestAuth) => {
    try {
        const response = await requestAuth.get('/contract/all');

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const contractsByEnterpriseApi = async (requestAuth, enterpriseId) => {
    try {
        const response = await requestAuth.get('/contract/by_enterprise', {
            params: {
                enterpriseId: enterpriseId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const positionsByContractApi = async (requestAuth, contractId) => {
    try {
        const response = await requestAuth.get('/position/by_contract', {
            params: {
                contractId: contractId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const positionsByEnterpriseApi = async (requestAuth) => {
    try {
        const response = await requestAuth.get('/position/by_enterprise_auth');

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getContractApi = async (requestAuth) => {
    try {
        const response = await requestAuth.get('/contract/by_enterprise');

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getContractDetailsByContractApi = async (
    requestAuth,
    contractId,
) => {
    try {
        const response = await requestAuth.get('/contract-detail/by_contract', {
            params: {
                contractId: contractId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getContractDetailsByContractWithAmount = async (
    requestAuth,
    contractId,
) => {
    try {
        const response = await requestAuth.get(
            '/contract-detail/by_contract_with_remaining_amount',
            {
                params: {
                    contractId: contractId,
                },
            },
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const ContractDetailsByContractAndPositionApi = async (
    requestAuth,
    contractId,
    positionId,
) => {
    try {
        const response = await requestAuth.get('/contract-detail/by_contract', {
            params: {
                contractId: contractId,
                positionId: positionId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getContractDetailsByPostApplyApi = async (
    requestAuth,
    postApplyId,
) => {
    try {
        const response = await requestAuth.get(
            '/contract-detail/by_post_apply',
            {
                params: {
                    postApplyId: postApplyId,
                },
            },
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getClassesByPostApplyAndStudentApi = async (
    requestAuth,
    postApplyId,
    studentId,
) => {
    try {
        const response = await requestAuth.get(
            '/class/compatibility_post_student',
            {
                params: {
                    postId: postApplyId,
                    studentId: studentId,
                },
            },
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const postsApi = async (requestAuth, params) => {
    const tested = params?.tested;
    const enterpriseId = params?.enterpriseId;
    try {
        const response = await requestAuth.get('/post-apply/by_enterprise', {
            params: {
                tested: tested,
                enterpriseId: enterpriseId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getTestsByPostsApi = async (
    requestAuth,
    postApplyId,
    studentId,
) => {
    try {
        const response = await requestAuth.get('/test/by_post', {
            params: {
                postApplyId: postApplyId,
                studentId: studentId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getTestsByIdsApi = async (requestAuth, ids) => {
    try {
        const response = await requestAuth.post(
            '/test/ids',
            JSON.stringify(ids),
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getTestsExamByIdsApi = async (requestAuth, ids) => {
    try {
        const response = await requestAuth.post(
            '/test/ids',
            JSON.stringify(ids),
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getTestDetailsByTestApi = async (requestAuth, testId) => {
    try {
        const response = await requestAuth.get('/test_details/by_test', {
            params: {
                testId: testId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const postsAllApi = async (requestAuth) => {
    try {
        const response = await requestAuth.get('/post-apply/all');

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getStatusPostApi = async (requestAuth, postApplyId) => {
    try {
        const response = await requestAuth.get('/post-apply/status', {
            params: {
                postApplyId: postApplyId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const jobsApi = async (requestAuth, params) => {
    try {
        const response = await requestAuth.get(
            '/apply/by_status',
            params
                ? {
                      params: {
                          status: params,
                      },
                  }
                : null,
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const jobsByContractApi = async (requestAuth, contractId) => {
    try {
        const response = await requestAuth.get('/apply/by_contract', {
            params: {
                contractId: contractId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const jobsByPostApi = async (requestAuth, postApplyId) => {
    try {
        const response = await requestAuth.get('/apply/by_post', {
            params: {
                postApplyId: postApplyId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const jobsByStudentApi = async (requestAuth) => {
    try {
        const response = await requestAuth.get('/post-apply/by_student_auth');

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const updateJobApi = async (requestAuth, data) => {
    try {
        const response = await requestAuth.put(
            '/apply/update',
            JSON.stringify(data),
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getApplyByStudentAndPostApi = async (requestAuth, postApplyId) => {
    try {
        const response = await requestAuth.get('/apply/by_student_post', {
            params: {
                postApplyId: postApplyId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getCourseByPositionApi = async (requestAuth, positionId) => {
    try {
        const response = await requestAuth.get(
            '/course/get_compatibility_position',
            {
                params: {
                    positionId: positionId,
                },
            },
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getClassByPositionApi = async (requestAuth, positionId) => {
    try {
        const response = await requestAuth.get(
            '/class/compatibility_position',
            {
                params: {
                    positionId: positionId,
                },
            },
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getTimeByPositionsApi = async (requestAuth, positionIds) => {
    try {
        const response = await requestAuth.post(
            '/position/time_by_positions',
            JSON.stringify(positionIds),
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getAmountByPositionsApi = async (requestAuth, positionIds) => {
    try {
        const response = await requestAuth.post(
            '/position/amount_by_positions',
            JSON.stringify(positionIds),
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getClassByStudentApi = async (requestAuth, studentId) => {
    try {
        const response = await requestAuth.get('/class/by_student', {
            params: {
                studentId: studentId,
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const getAmountByContractDetails = async (
    requestAuth,
    contractDetailsId,
) => {
    try {
        const response = await requestAuth.get(
            '/contract-detail/remaining_amount',
            {
                params: {
                    contractDetailsId: contractDetailsId,
                },
            },
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const updateStatusPost = async (requestAuth, data) => {
    try {
        const response = await requestAuth.put(
            '/post-apply/update_status',
            JSON.stringify(data),
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const updateNotePost = async (requestAuth, data) => {
    try {
        const response = await requestAuth.put(
            '/api/post-apply/update_note',
            JSON.stringify(data),
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const updateTimesPost = async (requestAuth, data) => {
    try {
        const response = await requestAuth.put(
            '/post-apply/update_times',
            JSON.stringify(data),
        );

        return response.data;
    } catch (err) {
        console.error(err);
    }
};

export const enterprisesApi = async (requestAuth) => {
    try {
        const response = await requestAuth.get('/enterprise/all');

        return response.data;
    } catch (err) {
        console.error(err);
    }
};
