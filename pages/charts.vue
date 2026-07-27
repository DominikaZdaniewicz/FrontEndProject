<template>
    <div>
        <apexchart
            class="apexchart"
            type= "bar"
            height= 500
            width= 1200
            :options="chartOptions"
            :series="series"/>
        <apexchart
            class="apexchart"
            type= "pie"
            height= 500
            :options="chartOptionsPie"
            :series="seriesPie"/>
    </div>
</template>

<script setup>
import { useServers } from '~/composable/useServers';
import { useApplications } from '~/composable/useApplications';
import { useTasks } from '~/composable/useTasks';
import { useUsers } from '~/composable/useUsers';

    const { backendServers, getServers } = useServers(); 
    const { backendApplications, getApplications } = useApplications();
    const { backendTasks, getTasks } = useTasks();
    const { backendUsers, getUsers } = useUsers();

    const admin = computed(() => backendUsers.value.filter(user => user.roles?.includes("administrator")));
    const users = computed(() => backendUsers.value.filter(user => !user.roles?.includes("administrator")));

    const series = computed(() => [
        {
            name: $t('number'),            
            data: [
                backendServers.value.length,
                backendApplications.value.length,
                backendTasks.value.length
            ]
        }
    ])

    const chartOptions = {
        title: {
            text: $t('chartName'),
            align: "left",
            offsetY: -10,
            style: {
                color: '#fff',
                fontSize: '32px',
                fontWeight: 'bold'
            }
        },
        chart: {
            id: "sales-chart",
            foreColor: '#fff',
            toolbar: {
                show: false,
            },
        },
        colors: ['#001F54', '#0077FF', '#A9D6FF'],
        plotOptions: {
            bar: {
                distributed: true
            }
        },
        xaxis: {
            categories: [$t('serversBtn'), $t('applicationsBtn'), $t('tasksBtn')]
        },
        yaxis: {
            min: 0,
            max: 16,
            tickAmount: 8
        },
        legend: {
            offsetY: 30,
            position: 'left',
            width: 300,
            fontSize: '16px',
            labels: {
                colors: '#fff'
            }
        }
    }

    const seriesPie = computed(() => [
        users.value.length,
        admin.value.length
    ])

    const chartOptionsPie = {
        // chart: {
        //     toolbar: {
        //         show: false
        //     }
        // },
        title: {
            text: $t('chartNameUsers'),
            align: 'left',
            offsetY: -10,
            style: {
                color: '#fff',
                fontSize: '32px',
                fontWeight: 'bold'
            }
        },
        stroke: {
            show: false
        },
        colors: ['#2E7D32', '#69F0AE'],
        labels: [$t('user'), $t('administrator')],
        legend: {
            offsetY: 30,
            position: 'left',
            width: 300,
            fontSize: '16px',
            labels: {
                colors: '#fff'                
            }
        }
    }
        
    onMounted(async () => {
        await getServers(),
        await getApplications(),
        await getTasks(),
        await getUsers()
    })

</script>

<style scoped>
    .apexchart {
        margin-top: 70px;
    }   
/* 
    :deep(.apexcharts-toolbar) {
        top: -10px !important;
    }

    :deep(.apexcharts-menu) {
        background: #1e1e1e !important;
    }

    :deep(.apexcharts-menu-item) {
        color: #00BCD4 !important;
        margin-top: 10px !important;
    }

    :deep(.apexcharts-menu-item:hover) {
        background: #333 !important;
        color: #fff !important;
    } */
/* 
    :deep(.apexcharts-toolbar .apexcharts-menu-icon) {
        padding: 5px !important;
        margin: 0 50px !important;
    }

    :deep(.apexcharts-toolbar .apexcharts-menu-icon svg path) {
        fill: #00BCD4 !important;
    } */

</style>
